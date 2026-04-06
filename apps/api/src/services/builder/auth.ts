import { db } from "../../db";
import { builders } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findBuilderByEmail(email: string) {
  const [builder] = await db
    .select()
    .from(builders)
    .where(eq(builders.email, email))
    .limit(1);
  return builder ?? null;
}

export async function createBuilder(data: {
  email: string;
  name: string;
}) {
  const [builder] = await db.insert(builders).values(data).returning();
  return builder;
}
