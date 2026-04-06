import Link from "next/link";
import { Bell } from "@phosphor-icons/react/dist/ssr";
import { getUser } from "@/lib/auth";
import { ProfileMenu } from "./profile-menu";

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
            <button
              type="button"
              className="flex items-center justify-center size-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-3.5" />
            </button>
          )}
          {user ? (
            <ProfileMenu
              name={user.name}
              email={user.email}
              role={user.role}
            />
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
