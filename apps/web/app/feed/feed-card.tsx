"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  CurrencyDollar,
  CaretDown,
  Lightning,
  Buildings,
  User,
} from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

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

export function FeedCard({ job }: { job: FeedJob }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group border border-border/60 bg-card transition-colors">
      {/* Main row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3.5 flex items-start sm:items-center gap-3 sm:gap-4"
      >
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span className="text-xs font-medium text-foreground truncate">
              {job.title}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 tracking-wide"
              >
                {workTypeLabels[job.workType]}
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 tracking-wide"
              >
                {job.workMode}
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 tracking-wide"
              >
                {talentLevelLabels[job.talentLevel]}
              </Badge>
            </div>
          </div>

          {/* Posted by — mobile shows inline, desktop shows in row */}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
            {job.seeker.company ? (
              <>
                <Buildings className="size-2.5 shrink-0" />
                <span>{job.seeker.company}</span>
                <span className="text-border">·</span>
              </>
            ) : (
              <>
                <User className="size-2.5 shrink-0" />
              </>
            )}
            <span>{job.seeker.name}</span>
            <span className="text-border">·</span>
            <span>{timeAgo(job.createdAt)}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-foreground/80 tabular-nums hidden sm:block">
            ${job.budgetAmount.toLocaleString()}
            {job.budgetType === "hourly" ? "/hr" : ""}
          </span>
          <CaretDown
            className={`size-3 text-muted-foreground/40 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border/40 px-4 py-4 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CurrencyDollar className="size-3 shrink-0" />
              <span>
                ${job.budgetAmount.toLocaleString()}
                {job.budgetType === "hourly" ? "/hr" : " fixed"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span className="capitalize">{job.workMode}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Lightning className="size-3 shrink-0" />
              <span>{talentLevelLabels[job.talentLevel]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3 shrink-0" />
              <span>{job.duration || "No timeline"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      )}
    </div>
  );
}
