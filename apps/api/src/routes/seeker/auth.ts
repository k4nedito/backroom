import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import { getOrCreateSeeker } from "../../services/seeker/auth";
import { AppError, ErrorCode } from "../../errors";

const otpRequestSchema = z.object({
  email: z.string().email(),
});

const otpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function seekerAuthRoutes(app: FastifyInstance) {
  app.post("/seeker/auth/otp", async (req, reply) => {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email");

    await createAndSendOtp(parsed.data.email);
    return { ok: true };
  });

  app.post("/seeker/auth/verify", async (req, reply) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email or code format");

    const { email, code } = parsed.data;
    await verifyOtp(email, code);
    const seeker = await getOrCreateSeeker(email);

    const token = app.jwt.sign(
      { id: seeker.id, email: seeker.email, role: "seeker" },
      { expiresIn: "7d" }
    );

    return { token, seeker };
  });
}
