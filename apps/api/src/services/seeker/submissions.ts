import { db } from "../../db";
import { submissions, builders, jobs } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

export async function getSubmissionsForJob(jobId: string, seekerId: string) {
  // verify the seeker owns this job
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.seekerId, seekerId)))
    .limit(1);

  if (!job) throw new AppError(ErrorCode.NOT_FOUND, "Job not found");

  const rows = await db
    .select({
      id: submissions.id,
      message: submissions.message,
      createdAt: submissions.createdAt,
      builder: {
        id: builders.id,
        name: builders.name,
        title: builders.title,
        bio: builders.bio,
        skills: builders.skills,
        hourlyRate: builders.hourlyRate,
        availability: builders.availability,
        timezone: builders.timezone,
        website: builders.website,
        github: builders.github,
        languages: builders.languages,
        workHistory: builders.workHistory,
        education: builders.education,
        profileComplete: builders.profileComplete,
      },
    })
    .from(submissions)
    .innerJoin(builders, eq(submissions.builderId, builders.id))
    .where(eq(submissions.jobId, jobId))
    .orderBy(desc(submissions.createdAt));

  return rows;
}

export async function getSubmissionCountsForSeeker(seekerId: string) {
  const rows = await db
    .select({
      jobId: submissions.jobId,
      id: submissions.id,
    })
    .from(submissions)
    .innerJoin(jobs, eq(submissions.jobId, jobs.id))
    .where(eq(jobs.seekerId, seekerId));

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.jobId] = (counts[row.jobId] || 0) + 1;
  }
  return counts;
}
