import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  integer,
  varchar,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const seekers = pgTable("seekers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const availabilityEnum = pgEnum("availability", [
  "full_time",
  "part_time",
  "not_available",
]);

export type WorkHistoryEntry = {
  company: string;
  role: string;
  from: string;
  to: string | null;
  description: string;
};

export type EducationEntry = {
  institution: string;
  degree: string;
  field: string;
  from: string;
  to: string | null;
};

export const builders = pgTable("builders", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  title: varchar("title", { length: 200 }),
  bio: text("bio"),
  skills: jsonb("skills").$type<string[]>().default([]),
  hourlyRate: integer("hourly_rate"),
  availability: availabilityEnum("availability"),
  timezone: varchar("timezone", { length: 100 }),
  website: varchar("website", { length: 500 }),
  github: varchar("github", { length: 200 }),
  linkedin: varchar("linkedin", { length: 200 }),
  languages: jsonb("languages").$type<string[]>().default([]),
  workHistory: jsonb("work_history").$type<WorkHistoryEntry[]>().default([]),
  education: jsonb("education").$type<EducationEntry[]>().default([]),
  profileComplete: boolean("profile_complete").default(false).notNull(),
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
export const recipientTypeEnum = pgEnum("recipient_type", [
  "seeker",
  "builder",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "new_submission",
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
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  builderId: uuid("builder_id")
    .notNull()
    .references(() => builders.id),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: uuid("recipient_id").notNull(),
  recipientType: recipientTypeEnum("recipient_type").notNull(),
  type: notificationTypeEnum("type").notNull(),
  submissionId: uuid("submission_id").references(() => submissions.id, {
    onDelete: "cascade",
  }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
