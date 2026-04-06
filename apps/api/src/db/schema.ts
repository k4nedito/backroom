import { pgTable, pgEnum, uuid, text, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core";

export const seekers = pgTable("seekers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workTypeEnum = pgEnum("work_type", [
  "from_scratch",
  "join_in_progress",
  "fix_ai_slop",
]);
export const workModeEnum = pgEnum("work_mode", ["remote", "office", "hybrid"]);
export const budgetTypeEnum = pgEnum("budget_type", ["fixed", "hourly"]);
export const talentLevelEnum = pgEnum("talent_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  seekerId: uuid("seeker_id")
    .notNull()
    .references(() => seekers.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  workType: workTypeEnum("work_type").notNull(),
  workMode: workModeEnum("work_mode").notNull(),
  budgetType: budgetTypeEnum("budget_type").notNull(),
  budgetAmount: integer("budget_amount").notNull(),
  duration: varchar("duration", { length: 100 }),
  talentLevel: talentLevelEnum("talent_level").notNull(),
  active: boolean("active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
