import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export default async function AuthPage() {
  const user = await getUser();
  if (user) redirect(user.role === "seeker" ? "/seeker/jobs" : "/builder/jobs");
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden bg-background p-4">
      {/* Dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle top gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent" />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-foreground/80">
            <div className="h-px w-6 bg-foreground/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
              Backrooms
            </span>
            <div className="h-px w-6 bg-foreground/20" />
          </div>
        </div>

        <AuthForm />

        {/* Footer */}
        <p className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">
          No commission. No tiers. No bullshit.
        </p>
      </div>
    </div>
  );
}
