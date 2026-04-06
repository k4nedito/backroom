import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { JobCard } from "./job-card";

type Job = {
  id: string;
  title: string;
  description: string;
  workType: "from_scratch" | "join_in_progress" | "fix_ai_slop";
  workMode: "remote" | "office" | "hybrid";
  budgetType: "fixed" | "hourly";
  budgetAmount: number;
  duration: string | null;
  talentLevel: "beginner" | "intermediate" | "advanced";
  active: boolean;
  createdAt: string;
};

export default async function MyJobsPage() {
  const user = await getUser();
  if (!user || user.role !== "seeker") redirect("/auth");

  const [jobsRes, countsRes] = await Promise.all([
    api<{ jobs: Job[] }>("/seeker/jobs", { method: "GET" }),
    api<{ counts: Record<string, number> }>("/seeker/submissions/counts", {
      method: "GET",
    }),
  ]);

  const jobs = jobsRes.data?.jobs ?? [];
  const counts = countsRes.data?.counts ?? {};

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium tracking-tight text-primary">My Jobs</h1>
          <p className="text-[11px] text-muted-foreground/60 tracking-wide">
            {jobs.length} {jobs.length === 1 ? "listing" : "listings"}
          </p>
        </div>
        <Button asChild size="sm" className="text-[11px] uppercase tracking-wider gap-1.5">
          <Link href="/seeker/jobs/new">
            <Plus className="size-3" />
            Post a job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-xs text-muted-foreground/50 tracking-wide">
            No jobs yet
          </p>
          <Button asChild variant="outline" size="sm" className="text-[11px] uppercase tracking-wider gap-1.5">
            <Link href="/seeker/jobs/new">
              <Plus className="size-3" />
              Create your first listing
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              submissionCount={counts[job.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
