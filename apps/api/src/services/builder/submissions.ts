import { db } from "../../db";
import { submissions } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

export async function createSubmission(builderId: string, jobId: string, message?: string) {
  const [existing] = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.builderId, builderId), eq(submissions.jobId, jobId)))
    .limit(1);

  if (existing) throw new AppError(ErrorCode.BAD_REQUEST, "Already submitted");

  const [sub] = await db
    .insert(submissions)
    .values({ builderId, jobId, message: message?.trim() || null })
    .returning();

  return sub;
}

export async function getSubmissionsByBuilderId(builderId: string) {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.builderId, builderId))
    .orderBy(submissions.createdAt);
}
