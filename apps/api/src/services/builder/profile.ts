import { db } from "../../db";
import { builders, type WorkHistoryEntry, type EducationEntry } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

export async function getBuilderById(id: string) {
  const [builder] = await db
    .select()
    .from(builders)
    .where(eq(builders.id, id))
    .limit(1);
  return builder ?? null;
}

export async function updateBuilderProfile(
  id: string,
  data: {
    name?: string;
    title?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
    availability?: "full_time" | "part_time" | "not_available";
    timezone?: string;
    website?: string;
    languages?: string[];
    workHistory?: WorkHistoryEntry[];
    education?: EducationEntry[];
  },
) {
  // Fetch current builder to merge with incoming data for profileComplete check
  const current = await getBuilderById(id);
  if (!current) throw new AppError(ErrorCode.NOT_FOUND, "Builder not found");

  const merged = { ...current, ...data };
  const profileComplete = !!(
    merged.title &&
    (merged.skills as string[])?.length &&
    merged.hourlyRate &&
    merged.availability &&
    merged.timezone
  );

  const [builder] = await db
    .update(builders)
    .set({ ...data, profileComplete, updatedAt: new Date() })
    .where(eq(builders.id, id))
    .returning();
  if (!builder) throw new AppError(ErrorCode.NOT_FOUND, "Builder not found");
  return builder;
}

export async function updateBuilderEmail(id: string, newEmail: string) {
  const [existing] = await db
    .select()
    .from(builders)
    .where(eq(builders.email, newEmail))
    .limit(1);
  if (existing) throw new AppError(ErrorCode.BAD_REQUEST, "Email already in use");

  const [builder] = await db
    .update(builders)
    .set({ email: newEmail, updatedAt: new Date() })
    .where(eq(builders.id, id))
    .returning();
  if (!builder) throw new AppError(ErrorCode.NOT_FOUND, "Builder not found");
  return builder;
}
