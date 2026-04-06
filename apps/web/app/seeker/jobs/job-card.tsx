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
  builder: {
    id: string;
    name: string;
    title: string | null;
    bio: string | null;
    skills: string[];
    hourlyRate: number | null;
    availability: "full_time" | "part_time" | "not_available" | null;
    timezone: string | null;
    website: string | null;
    github: string | null;
    languages: string[];
    workHistory: {
      company: string;
      role: string;
      from: string;
      to: string | null;
      description: string;
    }[];
    education: {
      institution: string;
      degree: string;
      field: string;
      from: string;
      to: string | null;
    }[];
    profileComplete: boolean;
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

function availabilityLabel(v: string | null) {
  if (v === "full_time") return "Full-time";
  if (v === "part_time") return "Part-time";
  if (v === "not_available") return "Not available";
  return null;
}

function BuilderCard({ submission }: { submission: Submission }) {
  const b = submission.builder;
  const initials = b.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const filledWork = b.workHistory.filter((w) => w.company && w.role);
  const filledEdu = b.education.filter((e) => e.institution && e.degree);
  const avail = availabilityLabel(b.availability);

  return (
    <div className="border border-border/60 bg-card border-t-2 border-t-primary/60 animate-in fade-in duration-200">
      {/* Message from builder */}
      {submission.message && (
        <div className="px-5 py-3 bg-primary/[0.04] border-b border-border/40">
          <p className="text-[11px] text-foreground/70 leading-relaxed whitespace-pre-wrap">
            {submission.message}
          </p>
          <p className="text-[10px] text-muted-foreground/40 mt-1.5">
            {timeAgo(submission.createdAt)}
          </p>
        </div>
      )}

      {/* Top band: avatar + identity + meta */}
      <div className="flex items-start gap-4 sm:gap-5 p-5 pb-4">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground text-sm sm:text-base font-semibold tracking-tight select-none ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold tracking-tight truncate">
            {b.name}
          </h3>
          {b.title && (
            <p className="text-[11px] text-primary/80 mt-0.5 truncate">
              {b.title}
            </p>
          )}
          {b.bio && (
            <p className="text-[11px] text-foreground/60 leading-relaxed mt-1.5 line-clamp-2">
              {b.bio}
            </p>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1 text-right">
          {b.hourlyRate && (
            <span className="text-sm font-semibold tracking-tight text-primary">
              ${b.hourlyRate}
              <span className="text-[10px] font-normal text-primary/60">
                /hr
              </span>
            </span>
          )}
          {avail && (
            <span className="text-[10px] text-muted-foreground tracking-wide uppercase">
              {avail}
            </span>
          )}
          {b.timezone && (
            <span className="text-[10px] text-muted-foreground/50 tracking-wide hidden sm:block">
              {b.timezone.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      {/* Skills */}
      {b.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pb-4">
          {b.skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center h-5 px-2 text-[10px] font-medium tracking-wide bg-primary/10 text-primary border border-primary/15 rounded-sm"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Experience + Education — collapsed on mobile */}
      {(filledWork.length > 0 || filledEdu.length > 0) && (
        <>
          <div className="h-px bg-border/40 mx-5" />
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-0 px-5 py-4">
            {/* Experience */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                Experience
              </h4>
              {filledWork.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {filledWork.slice(0, 3).map((w, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] font-semibold tracking-tight truncate">
                          {w.role}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground/50 tabular-nums">
                          {w.from}
                          {w.to ? ` — ${w.to}` : " — now"}
                        </span>
                      </div>
                      <span className="text-[10px] italic text-muted-foreground/70">
                        {w.company}
                      </span>
                    </div>
                  ))}
                  {filledWork.length > 3 && (
                    <span className="text-[10px] text-muted-foreground/40">
                      +{filledWork.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground/30 italic">
                  No experience listed
                </p>
              )}
            </div>

            {/* Divider — desktop only */}
            <div className="hidden sm:block w-px bg-border/40 mx-4" />
            <div className="sm:hidden h-px bg-border/40 my-3" />

            {/* Education + Languages + Links */}
            <div className="flex flex-col gap-4">
              {filledEdu.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                    Education
                  </h4>
                  {filledEdu.slice(0, 2).map((ed, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold tracking-tight">
                        {ed.degree}{" "}
                        <span className="font-normal text-muted-foreground/70">
                          in
                        </span>{" "}
                        {ed.field}
                      </span>
                      <span className="text-[10px] italic text-muted-foreground/70">
                        {ed.institution}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {b.languages.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                    Languages
                  </h4>
                  <p className="text-[10px] text-foreground/70">
                    {b.languages.join(" · ")}
                  </p>
                </div>
              )}

              {(b.website || b.github) && (
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                    Links
                  </h4>
                  <div className="flex flex-col gap-0.5">
                    {b.website && (
                      <span className="text-[10px] text-foreground/70 truncate">
                        {b.website.replace(/^https?:\/\//, "")}
                      </span>
                    )}
                    {b.github && (
                      <span className="text-[10px] text-foreground/70 truncate">
                        github.com/
                        <span className="font-medium">{b.github}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
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
                    <BuilderCard key={sub.id} submission={sub} />
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
