import { db } from "../db";
import { notifications } from "../db/schema";
import { and, eq } from "drizzle-orm";

type CreateNotificationInput = {
  recipientId: string;
  recipientType: "seeker" | "builder";
  type: "new_submission";
  submissionId?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return db.insert(notifications).values(input);
}

export async function getNotifications(
  recipientId: string,
  recipientType: "seeker" | "builder",
) {
  return db.query.notifications.findMany({
    where: and(
      eq(notifications.recipientId, recipientId),
      eq(notifications.recipientType, recipientType),
    ),
    orderBy: (n, { desc }) => desc(n.createdAt),
  });
}

export async function markRead(notificationId: string, recipientId: string) {
  return db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.recipientId, recipientId),
      ),
    );
}

export async function markAllRead(
  recipientId: string,
  recipientType: "seeker" | "builder",
) {
  return db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.recipientId, recipientId),
        eq(notifications.recipientType, recipientType),
      ),
    );
}
