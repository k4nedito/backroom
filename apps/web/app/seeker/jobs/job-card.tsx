"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  CurrencyDollar,
  CaretDown,
  Lightning,
  Eye,
  EyeSlash,
  Trash,
  EnvelopeSimple,
  User,
} from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { api } from "@/lib/api";
import { BuilderCard } from "@/components/builder-card";

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

type Submission = {
  id: string;
  message: string | null;
  createdAt: string;
  builder: import("@/components/builder-card").BuilderProfile & { id: string };
};

const workTypeLabels: Record<string, string> = {
  from_scratch: "From scratch",
  join_in_progress: "Join in progress",
  fix_ai_slop: "Fix AI slop",
};

const talentLevelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function timeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function JobCard({
  job,
  submissionCount,
}: {
  job: Job;
  submissionCount: number;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await api(`/seeker/jobs/${job.id}/toggle`, {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    await api(`/seeker/jobs/${job.id}`, {
      method: "DELETE",
      body: JSON.stringify({}),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleViewSubmissions() {
    if (showSubmissions) {
      setShowSubmissions(false);
      return;
    }

    if (!submissions) {
      setLoadingSubs(true);
      const { data } = await api<{ submissions: Submission[] }>(
        `/seeker/jobs/${job.id}/submissions`,
        { method: "GET" },
      );
      setSubmissions(data?.submissions ?? []);
      setLoadingSubs(false);
    }
    setShowSubmissions(true);
  }

  return (
    <div className="group border border-border/60 hover:border-primary/25 bg-card transition-colors border-l-2 border-l-primary/30 hover:border-l-primary/70">
      {/* Main row — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3.5 flex items-start sm:items-center gap-3 sm:gap-4"
      >
        {/* Status dot */}
        <span
          className={`mt-1.5 sm:mt-0 size-2 shrink-0 rounded-full ${
            job.active ? "bg-emerald-400" : "bg-muted-foreground/30"
          }`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <span className="text-xs font-medium text-foreground truncate">
            {job.title}
          </span>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              className="text-[10px] px-1.5 py-0 h-4 tracking-wide bg-primary/15 text-primary border-primary/20"
            >
              {workTypeLabels[job.workType]}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 tracking-wide border-border text-muted-foreground"
            >
              {job.workMode}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 tracking-wide border-border text-muted-foreground"
            >
              {talentLevelLabels[job.talentLevel]}
            </Badge>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {submissionCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-primary/70 font-medium">
              <EnvelopeSimple className="size-3" weight="fill" />
              {submissionCount}
            </span>
          )}
          <span className="text-[11px] text-primary font-medium tabular-nums hidden sm:block">
            ${job.budgetAmount.toLocaleString()}
            {job.budgetType === "hourly" ? "/hr" : ""}
          </span>
          <span className="text-[10px] text-muted-foreground/50 hidden sm:block">
            {timeAgo(job.createdAt)}
          </span>
          <CaretDown
            className={`size-3 text-muted-foreground/40 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border/40 px-4 py-4 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CurrencyDollar className="size-3 shrink-0 text-primary/70" />
              <span>
                ${job.budgetAmount.toLocaleString()}
                {job.budgetType === "hourly" ? "/hr" : " fixed"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0 text-primary/70" />
              <span className="capitalize">{job.workMode}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lightning className="size-3 shrink-0 text-primary/70" />
              <span>{talentLevelLabels[job.talentLevel]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3 shrink-0 text-primary/70" />
              <span>{job.duration || "No timeline"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-wrap mb-5">
            {job.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={handleToggle}
              className="text-[11px] uppercase tracking-wider gap-1.5"
            >
              {job.active ? (
                <>
                  <EyeSlash className="size-3" /> Deactivate
                </>
              ) : (
                <>
                  <Eye className="size-3" /> Activate
                </>
              )}
            </Button>
            {submissionCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                disabled={loadingSubs}
                onClick={handleViewSubmissions}
                className="text-[11px] uppercase tracking-wider gap-1.5"
              >
                <EnvelopeSimple className="size-3" />
                {loadingSubs
                  ? "Loading..."
                  : showSubmissions
                    ? "Hide submissions"
                    : `${submissionCount} ${submissionCount === 1 ? "submission" : "submissions"}`}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={handleDelete}
              className="text-[11px] uppercase tracking-wider gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash className="size-3" /> Delete
            </Button>
            <span className="ml-auto text-[10px] text-muted-foreground/40 sm:hidden tabular-nums">
              {timeAgo(job.createdAt)}
            </span>
          </div>

          {/* Submissions list */}
          {showSubmissions && submissions && (
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-col gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2">
                <User className="size-3 text-primary/70" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                  Builders interested
                </span>
              </div>
              {submissions.length === 0 ? (
                <p className="text-[10px] text-muted-foreground/40 italic py-4 text-center">
                  No submissions yet
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {submissions.map((sub) => (
                    <BuilderCard
                      key={sub.id}
                      builder={sub.builder}
                      message={sub.message}
                      messageTime={timeAgo(sub.createdAt)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
