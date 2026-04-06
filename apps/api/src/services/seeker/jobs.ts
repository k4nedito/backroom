import { db } from "../../db";
import { jobs } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

type CreateJobData = {
  seekerId: string;
  title: string;
  description: string;
  workType: "from_scratch" | "join_in_progress" | "fix_ai_slop";
  workMode: "remote" | "office" | "hybrid";
  budgetType: "fixed" | "hourly";
  budgetAmount: number;
  duration?: string;
  talentLevel: "beginner" | "intermediate" | "advanced";
};

type UpdateJobData = Partial<Omit<CreateJobData, "seekerId">>;

export async function createJob(data: CreateJobData) {
  const [job] = await db.insert(jobs).values(data).returning();
  return job;
}

export async function getJobById(id: string, seekerId: string) {
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.seekerId, seekerId)))
    .limit(1);
  return job ?? null;
}

export async function getJobsBySeekerID(seekerId: string) {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.seekerId, seekerId))
    .orderBy(jobs.createdAt);
}

export async function updateJob(
  id: string,
  seekerId: string,
  data: UpdateJobData,
) {
  const [job] = await db
    .update(jobs)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(jobs.id, id), eq(jobs.seekerId, seekerId)))
    .returning();
  if (!job) throw new AppError(ErrorCode.NOT_FOUND, "Job not found");
  return job;
}

export async function toggleJobActive(id: string, seekerId: string) {
  const existing = await getJobById(id, seekerId);
  if (!existing) throw new AppError(ErrorCode.NOT_FOUND, "Job not found");

  const [job] = await db
    .update(jobs)
    .set({ active: !existing.active, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();
  return job;
}

export async function deleteJob(id: string, seekerId: string) {
  const [job] = await db
    .delete(jobs)
    .where(and(eq(jobs.id, id), eq(jobs.seekerId, seekerId)))
    .returning();
  if (!job) throw new AppError(ErrorCode.NOT_FOUND, "Job not found");
  return job;
}
