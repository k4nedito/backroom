import { db } from "../../db";
import { jobs, submissions } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

export async function createSubmission(
  builderId: string,
  jobId: string,
  message?: string,
) {
  const [existing] = await db
    .select()
    .from(submissions)
    .where(
      and(eq(submissions.builderId, builderId), eq(submissions.jobId, jobId)),
    )
    .limit(1);

  if (existing) throw new AppError(ErrorCode.BAD_REQUEST, "Already submitted");

  const [sub] = await db
    .insert(submissions)
    .values({ builderId, jobId, message: message?.trim() || null })
    .returning();

  const [job] = await db
    .select({ seekerId: jobs.seekerId })
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  return { ...sub, seekerId: job.seekerId };
}

export async function getSubmissionsByBuilderId(builderId: string) {
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.builderId, builderId))
    .orderBy(submissions.createdAt);
}
