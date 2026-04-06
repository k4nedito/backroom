import { Suspense } from "react";
import { api } from "@/lib/api";
import { FeedFilters } from "./feed-filters";
import { FeedCard } from "./feed-card";

type FeedJob = {
  id: string;
  title: string;
  description: string;
  workType: "from_scratch" | "join_in_progress" | "fix_ai_slop";
  workMode: "remote" | "office" | "hybrid";
  budgetType: "fixed" | "hourly";
  budgetAmount: number;
  duration: string | null;
  talentLevel: "beginner" | "intermediate" | "advanced";
  createdAt: string;
  seeker: {
    name: string;
    company: string | null;
  };
};

async function JobList({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.workType) params.set("workType", searchParams.workType);
  if (searchParams.workMode) params.set("workMode", searchParams.workMode);
  if (searchParams.talentLevel) params.set("talentLevel", searchParams.talentLevel);
  if (searchParams.budgetType) params.set("budgetType", searchParams.budgetType);

  const qs = params.toString();
  const { data } = await api<{ jobs: FeedJob[] }>(
    `/feed/jobs${qs ? `?${qs}` : ""}`,
    { method: "GET", cache: "no-store" },
  );

  const jobs = data?.jobs ?? [];

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          No jobs found
        </p>
        <p className="text-[10px] text-muted-foreground/30 tracking-wide">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] text-muted-foreground/40 tracking-wide mb-1">
        {jobs.length} {jobs.length === 1 ? "listing" : "listings"}
      </p>
      {jobs.map((job) => (
        <FeedCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-sm font-medium tracking-tight text-primary">Job feed</h1>
        <p className="text-[11px] text-muted-foreground/60 tracking-wide">
          Active listings from seekers looking for builders.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Suspense>
          <FeedFilters />
        </Suspense>
        <JobList searchParams={params} />
      </div>
    </div>
  );
}
