import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import { findSeekerByEmail, createSeeker } from "../../services/seeker/auth";
import { AppError, ErrorCode } from "../../errors";

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
  company: z.string().optional(),
});

export async function seekerAuthRoutes(app: FastifyInstance) {
  // Step 1: send OTP
  app.post("/seeker/auth/otp", async (req, reply) => {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email");

    await createAndSendOtp(parsed.data.email);
    return { ok: true };
  });

  // Step 2: verify OTP — returns token if existing, or isNew flag if not
  app.post("/seeker/auth/verify", async (req, reply) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email or code format");

    const { email, code } = parsed.data;
    await verifyOtp(email, code);

    const seeker = await findSeekerByEmail(email);

    if (seeker) {
      const token = app.jwt.sign(
        { id: seeker.id, email: seeker.email, role: "seeker" },
        { expiresIn: "7d" }
      );
      return { isNew: false, token, seeker };
    }

    // New user — frontend needs to collect extra info
    // Give them a short-lived signup token so they don't have to OTP again
    const signupToken = app.jwt.sign({ email, purpose: "signup" }, { expiresIn: "15m" });
    return { isNew: true, signupToken };
  });

  // Step 3: complete signup (only for new users)
  app.post("/seeker/auth/signup", async (req, reply) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Name is required");

    const { email, name, company } = parsed.data;

    // Verify signup token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      throw new AppError(ErrorCode.UNAUTHORIZED, "Missing signup token");

    try {
      const payload = app.jwt.verify<{ email: string; purpose: string }>(
        authHeader.slice(7)
      );
      if (payload.purpose !== "signup" || payload.email !== email)
        throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid signup token");
    } catch {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid or expired signup token");
    }

    const existing = await findSeekerByEmail(email);
    if (existing)
      throw new AppError(ErrorCode.BAD_REQUEST, "Account already exists");

    const seeker = await createSeeker({ email, name, company });

    const token = app.jwt.sign(
      { id: seeker.id, email: seeker.email, role: "seeker" },
      { expiresIn: "7d" }
    );

    return { token, seeker };
  });
}
