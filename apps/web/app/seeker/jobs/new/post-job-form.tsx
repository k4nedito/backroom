"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const workTypes = [
  { value: "from_scratch", label: "Start from scratch" },
  { value: "join_in_progress", label: "Join in progress" },
  { value: "fix_ai_slop", label: "Fix AI slop" },
];

const workModes = [
  { value: "remote", label: "Remote" },
  { value: "office", label: "Office" },
  { value: "hybrid", label: "Hybrid" },
];

const talentLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  workType: z.enum(["from_scratch", "join_in_progress", "fix_ai_slop"]),
  workMode: z.enum(["remote", "office", "hybrid"]),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetAmount: z.number().int().positive(),
  duration: z.string().max(100).optional(),
  talentLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

export function PostJobForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workType, setWorkType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [budgetType, setBudgetType] = useState("fixed");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [talentLevel, setTalentLevel] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = schema.safeParse({
      title,
      description,
      workType,
      workMode,
      budgetType,
      budgetAmount: Number(budgetAmount),
      duration: duration || undefined,
      talentLevel,
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return setError(first?.message ?? "Please fill in all required fields");
    }

    setLoading(true);
    const { error: apiError } = await api("/seeker/jobs", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);

    if (apiError) return setError(apiError.message);

    router.push("/seeker/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Title */}
      <fieldset className="flex flex-col gap-1.5">
        <Label
          htmlFor="title"
          className="text-[11px] text-muted-foreground uppercase tracking-wider"
        >
          Job title
        </Label>
        <Input
          id="title"
          placeholder="e.g. Build a SaaS dashboard from scratch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
        />
      </fieldset>

      {/* Description */}
      <fieldset className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="description"
            className="text-[11px] text-muted-foreground uppercase tracking-wider"
          >
            Description
          </Label>
          <span className="text-[10px] text-muted-foreground/40 tabular-nums">
            {description.length}/5000
          </span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe the work, deliverables, tech stack, timeline expectations..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          rows={6}
          className="bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors resize-none"
        />
      </fieldset>

      {/* Work type + Work mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <fieldset className="flex flex-col gap-1.5">
          <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Type of work
          </Label>
          <Select value={workType} onValueChange={setWorkType}>
            <SelectTrigger className="w-full h-10 bg-transparent border-border/60">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {workTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        <fieldset className="flex flex-col gap-1.5">
          <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Work mode
          </Label>
          <Select value={workMode} onValueChange={setWorkMode}>
            <SelectTrigger className="w-full h-10 bg-transparent border-border/60">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {workModes.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <fieldset className="flex flex-col gap-1.5">
          <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Budget type
          </Label>
          <div className="flex items-center gap-0.5 rounded-none border border-border/60 p-0.5">
            {(["fixed", "hourly"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBudgetType(t)}
                className={`flex-1 py-2 text-[11px] font-medium uppercase tracking-wider transition-all duration-150 ${
                  budgetType === t
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-1.5">
          <Label
            htmlFor="budget"
            className="text-[11px] text-muted-foreground uppercase tracking-wider"
          >
            Amount{" "}
            <span className="text-muted-foreground/40 normal-case tracking-normal">
              (USD{budgetType === "hourly" ? "/hr" : " total"})
            </span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50">
              $
            </span>
            <Input
              id="budget"
              type="number"
              min={1}
              placeholder="0"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="h-10 pl-7 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </fieldset>
      </div>

      {/* Talent level + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <fieldset className="flex flex-col gap-1.5">
          <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
            Talent level
          </Label>
          <Select value={talentLevel} onValueChange={setTalentLevel}>
            <SelectTrigger className="w-full h-10 bg-transparent border-border/60">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {talentLevels.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        <fieldset className="flex flex-col gap-1.5">
          <Label
            htmlFor="duration"
            className="text-[11px] text-muted-foreground uppercase tracking-wider"
          >
            Duration{" "}
            <span className="text-muted-foreground/40 normal-case tracking-normal">
              optional
            </span>
          </Label>
          <Input
            id="duration"
            placeholder="e.g. 2 weeks, 3 months"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            maxLength={100}
            className="h-10 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
          />
        </fieldset>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-destructive animate-in fade-in duration-150">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <p className="text-[10px] text-muted-foreground/40 tracking-wide">
          Goes live immediately. Deactivate anytime.
        </p>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-8 text-xs font-medium uppercase tracking-wider"
        >
          {loading ? "Creating..." : "Create job"}
        </Button>
      </div>
    </form>
  );
}
