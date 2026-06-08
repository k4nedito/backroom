import Link from "next/link";
import { BellIcon } from "@phosphor-icons/react/dist/ssr";
import { getUser } from "@/lib/auth";
import { ProfileMenu } from "./profile-menu";
import { api } from "@/lib/api";
import { NotificationBell } from "./notification-bell";

const commonLinks = [{ href: "/feed", label: "Feed" }];

const seekerLinks = [
  ...commonLinks,
  { href: "/seeker/jobs", label: "My Jobs" },
  { href: "/seeker/jobs/new", label: "Post a Job" },
];

const builderLinks = [
  ...commonLinks,
  { href: "/builder/applications", label: "My Applications" },
  { href: "/builder/convos", label: "Convos" },
];

export async function Navbar() {
  const user = await getUser();

  let unreadCount = 0;
  let notifications: {
    id: string;
    type: string;
    read: boolean;
    createdAt: string;
  }[] = [];

  if (user?.role === "seeker") {
    const { data } = await api<{ notifications: typeof notifications }>(
      `/notifications/getAll?recipientId=${user.id}&recipientType=seeker`,
    );
    unreadCount = data?.notifications.filter((n) => !n.read).length ?? 0;
    notifications = data?.notifications ?? [];
  }

  return (
    <nav className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-5xl flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-primary"
          >
            Backrooms
          </Link>
          <div className="flex items-center gap-1">
            {(user
              ? user.role === "seeker"
                ? seekerLinks
                : builderLinks
              : commonLinks
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {user && (
            <NotificationBell
              initialNotifications={notifications}
              unreadCount={unreadCount}
              recipientId={user.id}
            />
          )}
          {user ? (
            <ProfileMenu name={user.name} email={user.email} role={user.role} />
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
