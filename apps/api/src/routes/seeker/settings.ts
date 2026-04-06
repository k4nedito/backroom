import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { AppError, ErrorCode } from "../../errors";
import { setAuthCookie } from "../../lib/cookies";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import {
  getSeekerById,
  updateSeekerProfile,
  updateSeekerEmail,
} from "../../services/seeker/settings";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
});

const emailRequestSchema = z.object({
  newEmail: z.string().email(),
});

const emailConfirmSchema = z.object({
  newEmail: z.string().email(),
  code: z.string().length(6),
});

export async function seekerSettingsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/seeker/settings", async (req) => {
    const seeker = await getSeekerById(req.user.id);
    if (!seeker) throw new AppError(ErrorCode.NOT_FOUND, "Seeker not found");
    return { seeker };
  });

  app.patch("/seeker/settings/profile", async (req, reply) => {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid data");

    const seeker = await updateSeekerProfile(req.user.id, parsed.data);

    const token = app.jwt.sign(
      { id: seeker.id, email: seeker.email, name: seeker.name, role: "seeker" as const },
      { expiresIn: "7d" },
    );
    setAuthCookie(reply, token);

    return { seeker };
  });

  app.post("/seeker/settings/email", async (req) => {
    const parsed = emailRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email");

    await createAndSendOtp(parsed.data.newEmail);
    return { ok: true };
  });

  app.post("/seeker/settings/email/verify", async (req, reply) => {
    const parsed = emailConfirmSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid data");

    const { newEmail, code } = parsed.data;
    await verifyOtp(newEmail, code);

    const seeker = await updateSeekerEmail(req.user.id, newEmail);

    const token = app.jwt.sign(
      { id: seeker.id, email: seeker.email, name: seeker.name, role: "seeker" as const },
      { expiresIn: "7d" },
    );
    setAuthCookie(reply, token);

    return { seeker };
  });
}
