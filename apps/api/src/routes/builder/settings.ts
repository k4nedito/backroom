import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { AppError, ErrorCode } from "../../errors";
import { setAuthCookie } from "../../lib/cookies";
import { createAndSendOtp, verifyOtp } from "../../services/otp";
import {
  getBuilderById,
  updateBuilderProfile,
  updateBuilderEmail,
} from "../../services/builder/profile";

const workHistorySchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  from: z.string().min(1),
  to: z.string().nullable(),
  description: z.string(),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  from: z.string().min(1),
  to: z.string().nullable(),
});

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).max(200).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string().min(1)).max(20).optional(),
  hourlyRate: z.number().int().positive().optional(),
  availability: z.enum(["full_time", "part_time", "not_available"]).optional(),
  timezone: z.string().min(1).max(100).optional(),
  website: z.string().url().max(500).optional(),
  github: z.string().max(200).optional(),
  languages: z.array(z.string().min(1)).max(20).optional(),
  workHistory: z.array(workHistorySchema).max(20).optional(),
  education: z.array(educationSchema).max(10).optional(),
});

const emailRequestSchema = z.object({
  newEmail: z.string().email(),
});

const emailConfirmSchema = z.object({
  newEmail: z.string().email(),
  code: z.string().length(6),
});

export async function builderSettingsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/builder/settings", async (req) => {
    const builder = await getBuilderById(req.user.id);
    if (!builder) throw new AppError(ErrorCode.NOT_FOUND, "Builder not found");
    return { builder };
  });

  app.patch("/builder/settings/profile", async (req, reply) => {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid data");

    const builder = await updateBuilderProfile(req.user.id, parsed.data);

    const token = app.jwt.sign(
      { id: builder.id, email: builder.email, name: builder.name, role: "builder" as const },
      { expiresIn: "7d" },
    );
    setAuthCookie(reply, token);

    return { builder };
  });

  app.post("/builder/settings/email", async (req) => {
    const parsed = emailRequestSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email");

    await createAndSendOtp(parsed.data.newEmail);
    return { ok: true };
  });

  app.post("/builder/settings/email/verify", async (req, reply) => {
    const parsed = emailConfirmSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid data");

    const { newEmail, code } = parsed.data;
    await verifyOtp(newEmail, code);

    const builder = await updateBuilderEmail(req.user.id, newEmail);

    const token = app.jwt.sign(
      { id: builder.id, email: builder.email, name: builder.name, role: "builder" as const },
      { expiresIn: "7d" },
    );
    setAuthCookie(reply, token);

    return { builder };
  });
}
