import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { AppError, ErrorCode } from "../../errors";
import {
  createJob,
  getJobById,
  getJobsBySeekerID,
  updateJob,
  toggleJobActive,
  deleteJob,
} from "../../services/seeker/jobs";

const workTypes = ["from_scratch", "join_in_progress", "fix_ai_slop"] as const;
const workModes = ["remote", "office", "hybrid"] as const;
const budgetTypes = ["fixed", "hourly"] as const;
const talentLevels = ["beginner", "intermediate", "advanced"] as const;

const createJobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  workType: z.enum(workTypes),
  workMode: z.enum(workModes),
  budgetType: z.enum(budgetTypes),
  budgetAmount: z.number().int().positive(),
  duration: z.string().max(100).optional(),
  talentLevel: z.enum(talentLevels),
});

const updateJobSchema = createJobSchema.partial();

const jobIdSchema = z.object({
  id: z.string().uuid(),
});

export async function seekerJobRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/seeker/jobs", async (req) => {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job data");

    const job = await createJob({ ...parsed.data, seekerId: req.user.id });
    return { job };
  });

  app.get("/seeker/jobs", async (req) => {
    const jobs = await getJobsBySeekerID(req.user.id);
    return { jobs };
  });

  app.get("/seeker/jobs/:id", async (req) => {
    const params = jobIdSchema.safeParse(req.params);
    if (!params.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job ID");

    const job = await getJobById(params.data.id, req.user.id);
    if (!job) throw new AppError(ErrorCode.NOT_FOUND, "Job not found");
    return { job };
  });

  app.patch("/seeker/jobs/:id", async (req) => {
    const params = jobIdSchema.safeParse(req.params);
    if (!params.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job ID");

    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job data");

    const job = await updateJob(params.data.id, req.user.id, parsed.data);
    return { job };
  });

  app.patch("/seeker/jobs/:id/toggle", async (req) => {
    const params = jobIdSchema.safeParse(req.params);
    if (!params.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job ID");

    const job = await toggleJobActive(params.data.id, req.user.id);
    return { job };
  });

  app.delete("/seeker/jobs/:id", async (req) => {
    const params = jobIdSchema.safeParse(req.params);
    if (!params.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job ID");

    await deleteJob(params.data.id, req.user.id);
    return { ok: true };
  });
}
