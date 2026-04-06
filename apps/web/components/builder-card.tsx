"use client";

export type BuilderProfile = {
  name: string;
  title: string | null;
  bio: string | null;
  skills: string[];
  hourlyRate: number | null;
  availability: "full_time" | "part_time" | "not_available" | null;
  timezone: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
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

function availabilityLabel(v: string | null) {
  if (v === "full_time") return "Full-time";
  if (v === "part_time") return "Part-time";
  if (v === "not_available") return "Not available";
  return null;
}

export function BuilderCard({
  builder,
  message,
  messageTime,
  showCompleteness = false,
}: {
  builder: BuilderProfile;
  message?: string | null;
  messageTime?: string | null;
  showCompleteness?: boolean;
}) {
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
      {/* Message from builder */}
      {message && (
        <div className="px-5 py-3 bg-primary/[0.04] border-b border-border/40">
          <p className="text-[11px] text-foreground/70 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
          {messageTime && (
            <p className="text-[10px] text-muted-foreground/40 mt-1.5">
              {messageTime}
            </p>
          )}
        </div>
      )}

      {/* Top band: avatar + identity + meta */}
      <div className="flex items-start gap-5 p-6 pb-5">
        <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-lg font-semibold tracking-tight select-none ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
          {initials}
        </div>

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

      {/* Skills band */}
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

      {/* Links band */}
      {(builder.website || builder.github || builder.linkedin) && (
        <div className="flex flex-wrap items-center gap-3 px-6 pb-5">
          {builder.website && (
            <a href={builder.website.startsWith("http") ? builder.website : `https://${builder.website}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-foreground/70 hover:text-primary transition-colors truncate">
              {builder.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {builder.github && (
            <a href={`https://github.com/${builder.github}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-foreground/70 hover:text-primary transition-colors truncate">
              github.com/<span className="font-medium">{builder.github}</span>
            </a>
          )}
          {builder.linkedin && (
            <a href={`https://linkedin.com/in/${builder.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-foreground/70 hover:text-primary transition-colors truncate">
              linkedin.com/in/<span className="font-medium">{builder.linkedin}</span>
            </a>
          )}
        </div>
      )}

      {/* Languages band */}
      {builder.languages.length > 0 && (
        <div className="flex items-center gap-2 px-6 pb-5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/70">
            Languages
          </span>
          <span className="text-[11px] text-foreground/70">
            {builder.languages.join(" · ")}
          </span>
        </div>
      )}

      <div className="h-px bg-border/40 mx-6" />

      {/* Body: two-column layout */}
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

        {/* Right column: education */}
        <div className="flex flex-col gap-4 pl-5">
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
      </div>

      {/* Completeness nudge */}
      {showCompleteness && !builder.profileComplete && (
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
