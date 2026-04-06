"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const workTypes = [
  { value: "from_scratch", label: "From scratch" },
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

const budgetTypes = [
  { value: "fixed", label: "Fixed price" },
  { value: "hourly", label: "Hourly rate" },
];

export function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const workType = searchParams.get("workType") ?? "";
  const workMode = searchParams.get("workMode") ?? "";
  const talentLevel = searchParams.get("talentLevel") ?? "";
  const budgetType = searchParams.get("budgetType") ?? "";

  const hasFilters = workType || workMode || talentLevel || budgetType || search;

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/feed?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/feed?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    router.push("/feed");
  }, [router]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" />
        <Input
          placeholder="Search jobs..."
          defaultValue={search}
          onChange={(e) => {
            const value = e.target.value;
            const timeout = setTimeout(() => setSearch(value), 300);
            return () => clearTimeout(timeout);
          }}
          className="h-10 pl-9 bg-transparent border-border/60 focus-visible:border-foreground/30 transition-colors"
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={workType || "all"}
          onValueChange={(v) => update("workType", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[130px] bg-transparent border-border/60 text-[11px] uppercase tracking-wider">
            <SelectValue placeholder="Work type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {workTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={workMode || "all"}
          onValueChange={(v) => update("workMode", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] bg-transparent border-border/60 text-[11px] uppercase tracking-wider">
            <SelectValue placeholder="Work mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            {workModes.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={talentLevel || "all"}
          onValueChange={(v) => update("talentLevel", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[130px] bg-transparent border-border/60 text-[11px] uppercase tracking-wider">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {talentLevels.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={budgetType || "all"}
          onValueChange={(v) => update("budgetType", v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] bg-transparent border-border/60 text-[11px] uppercase tracking-wider">
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All budgets</SelectItem>
            {budgetTypes.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 ml-1 px-2 py-1 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors tracking-wide"
          >
            <X className="size-2.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
