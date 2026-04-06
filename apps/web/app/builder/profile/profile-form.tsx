"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import type { Builder, WorkHistoryEntry, EducationEntry } from "./page";

// ─── helpers ─────────────────────────────────────────────────────────

const inputClass =
  "h-10 bg-transparent border-border/60 focus-visible:border-primary/40 focus-visible:ring-primary/20 transition-colors";
const labelClass =
  "text-[11px] text-muted-foreground uppercase tracking-wider";
const optionalHint = (
  <span className="text-muted-foreground/40 normal-case tracking-normal">
    optional
  </span>
);

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-medium tracking-tight">{title}</h2>
        <p className="text-[10px] text-muted-foreground/50 tracking-wide">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
);

// ─── empty templates ─────────────────────────────────────────────────

const emptyWork: WorkHistoryEntry = {
  company: "",
  role: "",
  from: "",
  to: null,
  description: "",
};

const emptyEdu: EducationEntry = {
  institution: "",
  degree: "",
  field: "",
  from: "",
  to: null,
};

// ─── availability label ──────────────────────────────────────────────

function availabilityLabel(v: string | null) {
  if (v === "full_time") return "Full-time";
  if (v === "part_time") return "Part-time";
  if (v === "not_available") return "Not available";
  return null;
}

// ─── public view modal ──────────────────────────────────────────────

function PublicProfileCard({ builder }: { builder: Builder }) {
  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const filledWork = builder.workHistory.filter((w) => w.company && w.role);
  const filledEdu = builder.education.filter((e) => e.institution && e.degree);
  const avail = availabilityLabel(builder.availability);

  return (
    <div className="flex flex-col gap-0 w-full border-t-2 border-t-primary/60">
      {/* ── Top band: avatar + identity + meta ─────────────── */}
      <div className="flex items-start gap-5 p-6 pb-5">
        {/* Avatar */}
        <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-lg font-semibold tracking-tight select-none ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
          {initials}
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold tracking-tight truncate">
            {builder.name}
          </h2>
          {builder.title && (
            <p className="text-xs text-primary/80 mt-0.5 truncate">
              {builder.title}
            </p>
          )}
          {builder.bio && (
            <p className="text-[11px] text-foreground/70 leading-relaxed mt-2 line-clamp-3">
              {builder.bio}
            </p>
          )}
        </div>

        {/* Quick stats — right column */}
        <div className="shrink-0 flex flex-col items-end gap-1.5 text-right">
          {builder.hourlyRate && (
            <span className="text-sm font-semibold tracking-tight text-primary">
              ${builder.hourlyRate}
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
          {builder.timezone && (
            <span className="text-[10px] text-muted-foreground/50 tracking-wide">
              {builder.timezone.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      {/* ── Skills band ────────────────────────────────────── */}
      {builder.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-6 pb-5">
          {builder.skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center h-5 px-2 text-[10px] font-medium tracking-wide bg-primary/10 text-primary border border-primary/15 rounded-sm"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="h-px bg-border/40 mx-6" />

      {/* ── Body: two-column layout ────────────────────────── */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-6 py-5">
        {/* Left column: experience */}
        <div className="flex flex-col gap-4 pr-5">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
            Experience
          </h3>
          {filledWork.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {filledWork.map((w, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold tracking-tight truncate">
                      {w.role}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground/50 tabular-nums">
                      {w.from}{w.to ? ` — ${w.to}` : " — present"}
                    </span>
                  </div>
                  <span className="text-[11px] italic text-muted-foreground/70">
                    {w.company}
                  </span>
                  {w.description && (
                    <p className="text-[10px] text-foreground/60 leading-relaxed mt-1">
                      {w.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground/30 italic">
              No experience added yet
            </p>
          )}
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-border/40" />

        {/* Right column: education + languages + links */}
        <div className="flex flex-col gap-5 pl-5">
          {/* Education */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
              Education
            </h3>
            {filledEdu.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filledEdu.map((ed, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold tracking-tight">
                      {ed.degree} <span className="font-normal text-muted-foreground/70">in</span>{" "}
                      <span className="font-medium">{ed.field}</span>
                    </span>
                    <span className="text-[11px] italic text-muted-foreground/70">
                      {ed.institution}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                      {ed.from}{ed.to ? ` — ${ed.to}` : " — present"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground/30 italic">
                No education added yet
              </p>
            )}
          </div>

          {/* Languages */}
          {builder.languages.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                Languages
              </h3>
              <p className="text-[11px] text-foreground/70">
                {builder.languages.join(" · ")}
              </p>
            </div>
          )}

          {/* Links */}
          {(builder.website || builder.github) && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
                Links
              </h3>
              <div className="flex flex-col gap-1">
                {builder.website && (
                  <span className="text-[11px] text-foreground/70 truncate">
                    {builder.website.replace(/^https?:\/\//, "")}
                  </span>
                )}
                {builder.github && (
                  <span className="text-[11px] text-foreground/70 truncate">
                    github.com/<span className="font-medium">{builder.github}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Completeness nudge ─────────────────────────────── */}
      {!builder.profileComplete && (
        <>
          <div className="h-px bg-border/40 mx-6" />
          <div className="px-6 py-3 bg-primary/[0.04]">
            <p className="text-[10px] text-primary/60 tracking-wide text-center">
              Complete your profile to rank higher in search
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────

export function ProfileForm({ builder }: { builder: Builder }) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);

  // basics
  const [name, setName] = useState(builder.name);
  const [title, setTitle] = useState(builder.title ?? "");
  const [bio, setBio] = useState(builder.bio ?? "");

  // skills
  const [skills, setSkills] = useState<string[]>(builder.skills);
  const [skillInput, setSkillInput] = useState("");

  // rate & availability
  const [hourlyRate, setHourlyRate] = useState(
    builder.hourlyRate?.toString() ?? "",
  );
  const [availability, setAvailability] = useState(
    builder.availability ?? "",
  );
  const [timezone, setTimezone] = useState(builder.timezone ?? "");

  // links & languages
  const [website, setWebsite] = useState(builder.website ?? "");
  const [github, setGithub] = useState(builder.github ?? "");
  const [languages, setLanguages] = useState<string[]>(builder.languages);
  const [langInput, setLangInput] = useState("");

  // work history
  const [workHistory, setWorkHistory] = useState<WorkHistoryEntry[]>(
    builder.workHistory,
  );

  // education
  const [education, setEducation] = useState<EducationEntry[]>(
    builder.education,
  );

  // save state
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // auto-detect timezone
  useEffect(() => {
    if (!timezone) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, [timezone]);

  // ── build a live preview builder from current form state ──────────

  function liveBuilder(): Builder {
    return {
      ...builder,
      name,
      title: title || null,
      bio: bio || null,
      skills,
      hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : null,
      availability: (availability || null) as Builder["availability"],
      timezone: timezone || null,
      website: website || null,
      github: github || null,
      languages,
      workHistory,
      education,
    };
  }

  // ── skill chips ──────────────────────────────────────────────────

  function addSkill() {
    const items = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !skills.includes(s));
    if (items.length && skills.length + items.length <= 20) {
      setSkills([...skills, ...items]);
    }
    setSkillInput("");
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((sk) => sk !== s));
  }

  // ── language chips ───────────────────────────────────────────────

  function addLanguage() {
    const items = langInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && !languages.includes(s));
    if (items.length) {
      setLanguages([...languages, ...items]);
    }
    setLangInput("");
  }

  function removeLanguage(l: string) {
    setLanguages(languages.filter((lang) => lang !== l));
  }

  // ── work history helpers ─────────────────────────────────────────

  function updateWork(i: number, patch: Partial<WorkHistoryEntry>) {
    setWorkHistory((wh) => wh.map((w, j) => (j === i ? { ...w, ...patch } : w)));
  }

  function removeWork(i: number) {
    setWorkHistory((wh) => wh.filter((_, j) => j !== i));
  }

  // ── education helpers ────────────────────────────────────────────

  function updateEdu(i: number, patch: Partial<EducationEntry>) {
    setEducation((ed) => ed.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  }

  function removeEdu(i: number) {
    setEducation((ed) => ed.filter((_, j) => j !== i));
  }

  // ── save profile ────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg("");
    setSaving(true);

    const { error } = await api("/builder/settings/profile", {
      method: "PATCH",
      body: JSON.stringify({
        name: name.trim(),
        title: title.trim() || undefined,
        bio: bio.trim() || undefined,
        skills,
        hourlyRate: hourlyRate ? parseInt(hourlyRate, 10) : undefined,
        availability: availability || undefined,
        timezone: timezone.trim() || undefined,
        website: website.trim() || undefined,
        github: github.trim() || undefined,
        languages,
        workHistory: workHistory.filter((w) => w.company && w.role),
        education: education.filter((ed) => ed.institution && ed.degree),
      }),
    });

    setSaving(false);

    if (error) {
      setSaveMsg(error.message);
      return;
    }

    setSaveMsg("Saved");
    router.refresh();
    setTimeout(() => setSaveMsg(""), 2000);
  }

  // ── render ───────────────────────────────────────────────────────

  return (
    <>
      {/* ── Public view button — sits in the page header row ─ */}
      <div className="-mt-[4.25rem] mb-10 flex justify-end pt-0.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="text-[10px] uppercase tracking-widest gap-1.5"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Public view
        </Button>
      </div>

      {/* ── Preview modal ───────────────────────────────────── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Public profile preview</DialogTitle>
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-6 pt-4 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium">
                This is what seekers see
              </span>
            </div>
            <div className="h-px bg-border/40" />
            <PublicProfileCard builder={liveBuilder()} />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Form ────────────────────────────────────────────── */}
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-10 animate-in fade-in duration-300"
      >
        {/* ── Basics ────────────────────────────────────────────── */}
        <Section title="Basics" description="Your public display info.">
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="name" className={labelClass}>
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </fieldset>

            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="title" className={labelClass}>
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior React Developer"
                className={inputClass}
              />
            </fieldset>

            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="bio" className={labelClass}>
                Bio {optionalHint}
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A few sentences about what you do and what you're looking for."
                rows={3}
                className="bg-transparent border-border/60 focus-visible:border-primary/40 focus-visible:ring-primary/20 transition-colors resize-none"
              />
            </fieldset>
          </div>
        </Section>

        <Divider />

        {/* ── Skills ────────────────────────────────────────────── */}
        <Section title="Skills" description="Up to 20. These drive search ranking.">
          <div className="flex flex-col gap-3">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-[10px] tracking-wide pl-2 pr-1 gap-1 cursor-default group"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="ml-0.5 opacity-40 hover:opacity-100 transition-opacity text-[10px] leading-none"
                      aria-label={`Remove ${s}`}
                    >
                      x
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="React, TypeScript, Node.js"
                className={`${inputClass} flex-1`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                className="text-[11px] uppercase tracking-wider shrink-0"
              >
                Add
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/40 tracking-wide">
              {skills.length}/20 — press enter or click add
            </p>
          </div>
        </Section>

        <Divider />

        {/* ── Rate & Availability ───────────────────────────────── */}
        <Section
          title="Rate & availability"
          description="Helps seekers filter and find you."
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <fieldset className="flex flex-col gap-1.5">
                <Label htmlFor="rate" className={labelClass}>
                  Hourly rate{" "}
                  <span className="text-muted-foreground/40 normal-case tracking-normal">
                    USD
                  </span>
                </Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs">
                    $
                  </span>
                  <Input
                    id="rate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="75"
                    className={`${inputClass} pl-6`}
                  />
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-1.5">
                <Label className={labelClass}>Availability</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="not_available">Not available</SelectItem>
                  </SelectContent>
                </Select>
              </fieldset>
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="timezone" className={labelClass}>
                Timezone
              </Label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="America/New_York"
                className={inputClass}
              />
            </fieldset>
          </div>
        </Section>

        <Divider />

        {/* ── Website & Languages ───────────────────────────────── */}
        <Section title="Links & languages" description="Help seekers learn more about you.">
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="website" className={labelClass}>
                Website {optionalHint}
              </Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className={inputClass}
              />
            </fieldset>

            <fieldset className="flex flex-col gap-1.5">
              <Label htmlFor="github" className={labelClass}>
                GitHub {optionalHint}
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-[11px]">
                  github.com/
                </span>
                <Input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="username"
                  className={`${inputClass} pl-[5.75rem]`}
                />
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1.5">
              <Label className={labelClass}>Languages {optionalHint}</Label>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {languages.map((l) => (
                    <Badge
                      key={l}
                      variant="outline"
                      className="text-[10px] tracking-wide pl-2 pr-1 gap-1 cursor-default"
                    >
                      {l}
                      <button
                        type="button"
                        onClick={() => removeLanguage(l)}
                        className="ml-0.5 opacity-40 hover:opacity-100 transition-opacity text-[10px] leading-none"
                        aria-label={`Remove ${l}`}
                      >
                        x
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={langInput}
                  onChange={(e) => setLangInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                  placeholder="English, Spanish"
                  className={`${inputClass} flex-1`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLanguage}
                  className="text-[11px] uppercase tracking-wider shrink-0"
                >
                  Add
                </Button>
              </div>
            </fieldset>
          </div>
        </Section>

        <Divider />

        {/* ── Work History ──────────────────────────────────────── */}
        <Section title="Work history" description="Most recent first. Only filled entries are saved.">
          <div className="flex flex-col gap-6">
            {workHistory.map((w, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-4 border border-border/40 rounded-sm relative animate-in fade-in duration-200"
              >
                <button
                  type="button"
                  onClick={() => removeWork(i)}
                  className="absolute top-3 right-3 text-[10px] text-muted-foreground/40 hover:text-destructive transition-colors"
                  aria-label="Remove entry"
                >
                  remove
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>
                      Company
                    </Label>
                    <Input
                      value={w.company}
                      onChange={(e) =>
                        updateWork(i, { company: e.target.value })
                      }
                      placeholder="Acme Inc."
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>Role</Label>
                    <Input
                      value={w.role}
                      onChange={(e) =>
                        updateWork(i, { role: e.target.value })
                      }
                      placeholder="Frontend Engineer"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>From</Label>
                    <Input
                      value={w.from}
                      onChange={(e) =>
                        updateWork(i, { from: e.target.value })
                      }
                      placeholder="2022-01"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>
                      To{" "}
                      <span className="text-muted-foreground/40 normal-case tracking-normal">
                        blank = present
                      </span>
                    </Label>
                    <Input
                      value={w.to ?? ""}
                      onChange={(e) =>
                        updateWork(i, {
                          to: e.target.value || null,
                        })
                      }
                      placeholder="2024-06"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                </div>

                <fieldset className="flex flex-col gap-1">
                  <Label className={`${labelClass} text-[10px]`}>
                    Description {optionalHint}
                  </Label>
                  <Textarea
                    value={w.description}
                    onChange={(e) =>
                      updateWork(i, { description: e.target.value })
                    }
                    placeholder="What you built, shipped, or improved."
                    rows={2}
                    className="bg-transparent border-border/60 focus-visible:border-primary/40 focus-visible:ring-primary/20 transition-colors resize-none text-xs"
                  />
                </fieldset>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setWorkHistory([...workHistory, { ...emptyWork }])}
              className="flex items-center justify-center gap-1.5 h-10 border border-dashed border-border/50 rounded-sm text-[11px] text-muted-foreground/50 hover:text-foreground/70 hover:border-border transition-colors tracking-wide"
            >
              + add position
            </button>
          </div>
        </Section>

        <Divider />

        {/* ── Education ─────────────────────────────────────────── */}
        <Section title="Education" description="Degrees, certifications, bootcamps — whatever applies.">
          <div className="flex flex-col gap-6">
            {education.map((ed, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-4 border border-border/40 rounded-sm relative animate-in fade-in duration-200"
              >
                <button
                  type="button"
                  onClick={() => removeEdu(i)}
                  className="absolute top-3 right-3 text-[10px] text-muted-foreground/40 hover:text-destructive transition-colors"
                  aria-label="Remove entry"
                >
                  remove
                </button>

                <fieldset className="flex flex-col gap-1">
                  <Label className={`${labelClass} text-[10px]`}>
                    Institution
                  </Label>
                  <Input
                    value={ed.institution}
                    onChange={(e) =>
                      updateEdu(i, { institution: e.target.value })
                    }
                    placeholder="MIT, Codecademy, etc."
                    className={`${inputClass} h-9 text-xs`}
                  />
                </fieldset>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>
                      Degree
                    </Label>
                    <Input
                      value={ed.degree}
                      onChange={(e) =>
                        updateEdu(i, { degree: e.target.value })
                      }
                      placeholder="B.S., Certificate"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>
                      Field
                    </Label>
                    <Input
                      value={ed.field}
                      onChange={(e) =>
                        updateEdu(i, { field: e.target.value })
                      }
                      placeholder="Computer Science"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>From</Label>
                    <Input
                      value={ed.from}
                      onChange={(e) =>
                        updateEdu(i, { from: e.target.value })
                      }
                      placeholder="2018"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                  <fieldset className="flex flex-col gap-1">
                    <Label className={`${labelClass} text-[10px]`}>
                      To{" "}
                      <span className="text-muted-foreground/40 normal-case tracking-normal">
                        blank = present
                      </span>
                    </Label>
                    <Input
                      value={ed.to ?? ""}
                      onChange={(e) =>
                        updateEdu(i, {
                          to: e.target.value || null,
                        })
                      }
                      placeholder="2022"
                      className={`${inputClass} h-9 text-xs`}
                    />
                  </fieldset>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setEducation([...education, { ...emptyEdu }])}
              className="flex items-center justify-center gap-1.5 h-10 border border-dashed border-border/50 rounded-sm text-[11px] text-muted-foreground/50 hover:text-foreground/70 hover:border-border transition-colors tracking-wide"
            >
              + add education
            </button>
          </div>
        </Section>

        <Divider />

        {/* ── Save ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 sticky bottom-0 py-4 bg-background/80 backdrop-blur-sm -mx-4 px-4">
          <Button
            type="submit"
            disabled={saving}
            size="sm"
            className="text-[11px] uppercase tracking-wider"
          >
            {saving ? "Saving..." : "Save profile"}
          </Button>
          {saveMsg && (
            <span
              className={`text-[11px] animate-in fade-in duration-150 ${
                saveMsg === "Saved"
                  ? "text-muted-foreground/60"
                  : "text-destructive"
              }`}
            >
              {saveMsg}
            </span>
          )}
        </div>

        {/* bottom spacing */}
        <div className="h-6" />
      </form>
    </>
  );
}
