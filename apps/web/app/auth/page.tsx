import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export default async function AuthPage() {
  const user = await getUser();
  if (user) redirect(user.role === "seeker" ? "/seeker/jobs" : "/builder/jobs");
  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-10">
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
