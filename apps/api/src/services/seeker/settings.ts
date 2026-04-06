import { db } from "../../db";
import { seekers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { AppError, ErrorCode } from "../../errors";

export async function updateSeekerProfile(
  id: string,
  data: { name?: string; company?: string },
) {
  const [seeker] = await db
    .update(seekers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(seekers.id, id))
    .returning();
  if (!seeker) throw new AppError(ErrorCode.NOT_FOUND, "Seeker not found");
  return seeker;
}

export async function updateSeekerEmail(id: string, newEmail: string) {
  // Check if email is already taken
  const [existing] = await db
    .select()
    .from(seekers)
    .where(eq(seekers.email, newEmail))
    .limit(1);
  if (existing) throw new AppError(ErrorCode.BAD_REQUEST, "Email already in use");

  const [seeker] = await db
    .update(seekers)
    .set({ email: newEmail, updatedAt: new Date() })
    .where(eq(seekers.id, id))
    .returning();
  if (!seeker) throw new AppError(ErrorCode.NOT_FOUND, "Seeker not found");
  return seeker;
}

export async function getSeekerById(id: string) {
  const [seeker] = await db
    .select()
    .from(seekers)
    .where(eq(seekers.id, id))
    .limit(1);
  return seeker ?? null;
}
