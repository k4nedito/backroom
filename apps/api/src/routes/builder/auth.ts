import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import { findBuilderByEmail, createBuilder } from "../../services/builder/auth";
import { AppError, ErrorCode } from "../../errors";
import { setAuthCookie, setSignupCookie } from "../../lib/cookies";

const otpRequestSchema = z.object({
  email: z.string().email(),
});

const otpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function builderAuthRoutes(app: FastifyInstance) {
  // Step 1: send OTP
  app.post("/builder/auth/otp", async (req, reply) => {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email");

    await createAndSendOtp(parsed.data.email);
    return { ok: true };
  });

  // Step 2: verify OTP — returns token if existing, or isNew flag if not
  app.post("/builder/auth/verify", async (req, reply) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email or code format");

    const { email, code } = parsed.data;
    await verifyOtp(email, code);

    const builder = await findBuilderByEmail(email);

    if (builder) {
      const token = app.jwt.sign(
        { id: builder.id, email: builder.email, name: builder.name, role: "builder" },
        { expiresIn: "7d" }
      );
      setAuthCookie(reply, token);
      return { isNew: false, builder };
    }

    const signupToken = app.jwt.sign({ email, purpose: "signup" }, { expiresIn: "15m" });
    setSignupCookie(reply, signupToken);
    return { isNew: true };
  });

  // Step 3: complete signup (only for new users)
  app.post("/builder/auth/signup", async (req, reply) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Name is required");

    const { email, name } = parsed.data;

    const signupToken = req.cookies.signup_token;
    if (!signupToken)
      throw new AppError(ErrorCode.UNAUTHORIZED, "Missing signup token");

    try {
      const payload = app.jwt.verify<{ email: string; purpose: string }>(signupToken);
      if (payload.purpose !== "signup" || payload.email !== email)
        throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid signup token");
    } catch {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid or expired signup token");
    }

    const existing = await findBuilderByEmail(email);
    if (existing)
      throw new AppError(ErrorCode.BAD_REQUEST, "Account already exists");

    const builder = await createBuilder({ email, name });

    const token = app.jwt.sign(
      { id: builder.id, email: builder.email, name: builder.name, role: "builder" },
      { expiresIn: "7d" }
    );

    setAuthCookie(reply, token);
    reply.clearCookie("signup_token", { path: "/" });
    return { builder };
  });

  app.post("/builder/auth/logout", async (req, reply) => {
    reply.clearCookie("token", { path: "/" });
    return { ok: true };
  });
}
