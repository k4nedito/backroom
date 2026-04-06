import { db } from "../db";
import { jobs, seekers } from "../db/schema";
import { eq, and, ilike, desc, or, SQL } from "drizzle-orm";

type FeedFilters = {
  search?: string;
  workType?: string;
  workMode?: string;
  talentLevel?: string;
  budgetType?: string;
};

export async function getActiveJobs(filters: FeedFilters) {
  const conditions: SQL[] = [eq(jobs.active, true)];

  if (filters.workType) conditions.push(eq(jobs.workType, filters.workType as any));
  if (filters.workMode) conditions.push(eq(jobs.workMode, filters.workMode as any));
  if (filters.talentLevel) conditions.push(eq(jobs.talentLevel, filters.talentLevel as any));
  if (filters.budgetType) conditions.push(eq(jobs.budgetType, filters.budgetType as any));

  if (filters.search) {
    conditions.push(
      or(
        ilike(jobs.title, `%${filters.search}%`),
        ilike(jobs.description, `%${filters.search}%`),
      )!,
    );
  }

  const rows = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      workType: jobs.workType,
      workMode: jobs.workMode,
      budgetType: jobs.budgetType,
      budgetAmount: jobs.budgetAmount,
      duration: jobs.duration,
      talentLevel: jobs.talentLevel,
      createdAt: jobs.createdAt,
      seekerName: seekers.name,
      seekerCompany: seekers.company,
    })
    .from(jobs)
    .innerJoin(seekers, eq(jobs.seekerId, seekers.id))
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    workType: row.workType,
    workMode: row.workMode,
    budgetType: row.budgetType,
    budgetAmount: row.budgetAmount,
    duration: row.duration,
    talentLevel: row.talentLevel,
    createdAt: row.createdAt,
    seeker: {
      name: row.seekerName,
      company: row.seekerCompany,
    },
  }));
}
