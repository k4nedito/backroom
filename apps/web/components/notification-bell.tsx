"use client";

import { useState } from "react";
import { Bell } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { api } from "@/lib/api";

type Notification = {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  jobId?: string;
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell({
  initialNotifications,
  unreadCount: initialUnreadCount,
  recipientId,
}: {
  initialNotifications: Notification[];
  unreadCount: number;
  recipientId: string;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  async function handleMarkRead(id: string) {
    await api("/notifications/markRead", {
      method: "POST",
      body: JSON.stringify({ notificationId: id, recipientId }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  const notificationLabels: Record<string, string> = {
    new_submission: "New submission on your job",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center size-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="size-3.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="px-4 py-2.5 border-b border-border/40 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Notifications
          </p>
          {unreadCount > 0 && (
            <span className="text-[10px] text-primary tabular-nums">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
          {notifications.length === 0 ? (
            <p className="text-[11px] text-muted-foreground/40 text-center py-8">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/30 flex items-start gap-3 cursor-pointer ${
                  n.read ? "opacity-40" : ""
                }`}
              >
                <span
                  className={`mt-1.5 size-1.5 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-primary"}`}
                />
                <div>
                  <p className="text-[11px] text-foreground leading-snug">
                    {notificationLabels[n.type] ?? "New notification"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
