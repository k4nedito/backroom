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
  PaperPlaneTilt,
  CheckCircle,
} from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { api } from "@/lib/api";

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

export function FeedCard({
  job,
  isBuilder,
  alreadyApplied,
}: {
  job: FeedJob;
  isBuilder: boolean;
  alreadyApplied: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(alreadyApplied);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    const { error: err } = await api("/builder/submissions", {
      method: "POST",
      body: JSON.stringify({
        jobId: job.id,
        message: message.trim() || undefined,
      }),
    });
    setSubmitting(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSubmitted(true);
    setModalOpen(false);
  }

  return (
    <div className="group border border-border/60 hover:border-primary/25 bg-card transition-colors border-l-2 border-l-primary/30 hover:border-l-primary/70">
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
              {isBuilder && submitted && (
                <span className="flex items-center gap-1 text-[10px] text-primary/70">
                  <CheckCircle className="size-3" weight="fill" />
                  Submitted
                </span>
              )}
            </div>
          </div>

          {/* Posted by */}
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
          <span className="text-[11px] text-primary font-medium tabular-nums hidden sm:block">
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
          <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>

          {/* Submit button — builders only */}
          {isBuilder && (
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/30">
              {submitted ? (
                <span className="flex items-center gap-1.5 text-[11px] text-primary/70">
                  <CheckCircle className="size-3.5" weight="fill" />
                  Submitted
                </span>
              ) : (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="text-[11px] uppercase tracking-wider gap-1.5"
                >
                  <PaperPlaneTilt className="size-3" />
                  I'm in
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Submit to {job.title}</DialogTitle>
          <div className="flex flex-col">
            <div className="px-5 pt-4 pb-3">
              <p className="text-xs font-medium tracking-tight">
                {job.title}
              </p>
              <p className="text-[10px] text-muted-foreground/50 tracking-wide mt-0.5">
                Your profile will be shared with the seeker
              </p>
            </div>
            <div className="h-px bg-border/40" />
            <div className="px-5 py-4 flex flex-col gap-3">
              <label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Anything else they should know?
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Why you're a good fit, availability, relevant work..."
                rows={4}
                maxLength={2000}
                className="bg-transparent border-border/60 focus-visible:border-primary/40 focus-visible:ring-primary/20 transition-colors resize-none text-xs"
              />
              <p className="text-[10px] text-muted-foreground/30 tracking-wide text-right">
                {message.length}/2000
              </p>
              {error && (
                <p className="text-[11px] text-destructive">{error}</p>
              )}
            </div>
            <div className="h-px bg-border/40" />
            <div className="px-5 py-3 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-[11px] uppercase tracking-wider"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={submitting}
                onClick={handleSubmit}
                className="text-[11px] uppercase tracking-wider gap-1.5"
              >
                <PaperPlaneTilt className="size-3" />
                {submitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
