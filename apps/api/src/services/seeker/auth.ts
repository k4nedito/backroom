import { db } from "../../db";
import { seekers } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findSeekerByEmail(email: string) {
  const [seeker] = await db
    .select()
    .from(seekers)
    .where(eq(seekers.email, email))
    .limit(1);
  return seeker ?? null;
}

export async function createSeeker(data: {
  email: string;
  name: string;
  company?: string;
}) {
  const [seeker] = await db.insert(seekers).values(data).returning();
  return seeker;
}
