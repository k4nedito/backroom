import { db } from "../../db";
import { seekers } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateSeeker(email: string) {
  const [existing] = await db
    .select()
    .from(seekers)
    .where(eq(seekers.email, email))
    .limit(1);

  if (existing) return existing;

  const [seeker] = await db
    .insert(seekers)
    .values({ email, name: email.split("@")[0] })
    .returning();

  return seeker;
}
