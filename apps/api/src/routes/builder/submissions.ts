import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { AppError, ErrorCode } from "../../errors";
import {
  createSubmission,
  getSubmissionsByBuilderId,
} from "../../services/builder/submissions";

const submitSchema = z.object({
  jobId: z.string().uuid(),
  message: z.string().max(2000).optional(),
});

export async function builderSubmissionRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/builder/submissions", async (req) => {
    if (req.user.role !== "builder")
      throw new AppError(ErrorCode.FORBIDDEN, "Builders only");

    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid submission data");

    const submission = await createSubmission(
      req.user.id,
      parsed.data.jobId,
      parsed.data.message,
    );
    return { submission };
  });

  app.get("/builder/submissions/job-ids", async (req) => {
    if (req.user.role !== "builder")
      throw new AppError(ErrorCode.FORBIDDEN, "Builders only");

    const subs = await getSubmissionsByBuilderId(req.user.id);
    return { jobIds: subs.map((s) => s.jobId) };
  });
}
