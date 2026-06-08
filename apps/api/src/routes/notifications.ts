import { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { AppError, ErrorCode } from "../errors";
import {
  createNotification,
  getNotifications,
  markRead,
  markAllRead,
} from "../services/notifications";

export const createNotificationSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["seeker", "builder"]),
  type: z.literal("new_submission"),
  submissionId: z.string().optional(),
});

export const getNotificationsSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(["seeker", "builder"]),
});

export const markReadSchema = z.object({
  notificationId: z.string(),
  recipientId: z.string(),
});

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/notifications/create", async (req) => {
    const parsed = createNotificationSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Invalid notification schema",
      );

    await createNotification(parsed.data);
    return { ok: true };
  });

  app.get("/notifications/getAll", async (req) => {
    const parsed = getNotificationsSchema.safeParse(req.query);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid query params");

    const notifications = await getNotifications(
      parsed.data.recipientId,
      parsed.data.recipientType,
    );

    return { notifications };
  });

  app.post("/notifications/markRead", async (req) => {
    const parsed = markReadSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid body params");

    await markRead(parsed.data.notificationId, parsed.data.recipientId);

    return { ok: true };
  });

  app.post("/notifications/markAllRead", async (req) => {
    // the schema for markAllRead matches exactly with getNotificationsSchema
    const parsed = getNotificationsSchema.safeParse(req.body);

    if (!parsed.success)
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid Body Params");

    await markAllRead(parsed.data.recipientId, parsed.data.recipientType);
  });
}
