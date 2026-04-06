import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { AppError, ErrorCode } from "../../errors";
import {
  getSubmissionsForJob,
  getSubmissionCountsForSeeker,
} from "../../services/seeker/submissions";

const jobIdSchema = z.object({
  id: z.string().uuid(),
});

export async function seekerSubmissionRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/seeker/jobs/:id/submissions", async (req) => {
    const params = jobIdSchema.safeParse(req.params);
    if (!params.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid job ID");

    const submissions = await getSubmissionsForJob(params.data.id, req.user.id);
    return { submissions };
  });

  app.get("/seeker/submissions/counts", async (req) => {
    const counts = await getSubmissionCountsForSeeker(req.user.id);
    return { counts };
  });
}
