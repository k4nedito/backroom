import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import { getOrCreateSeeker } from "../../services/seeker/auth";

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
      return reply.status(400).send({ error: parsed.error.flatten() });

    await createAndSendOtp(parsed.data.email);
    return { ok: true };
  });

  app.post("/seeker/auth/verify", async (req, reply) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success)
      return reply.status(400).send({ error: parsed.error.flatten() });

    const { email, code } = parsed.data;
    const result = await verifyOtp(email, code);

    if (!result.valid)
      return reply.status(401).send({ error: result.error });

    const seeker = await getOrCreateSeeker(email);

    const token = app.jwt.sign(
      { id: seeker.id, email: seeker.email, role: "seeker" },
      { expiresIn: "7d" }
    );

    return { token, seeker };
  });
}
