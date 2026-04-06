import Link from "next/link";
import {
  ArrowRight,
  Lightning,
  CurrencyDollar,
  Eye,
  Prohibit,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-24 pb-20">
        <div className="flex flex-col gap-8">
          {/* Tagline chip */}
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <div className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Work finds work
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight max-w-lg">
            The place where you
            <br />
            <span className="text-primary">get shit done.</span>
          </h1>

          <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-md">
            Post a job. Find a builder. Ship it. No commission, no tiers, no
            middlemen extracting value from your work.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
            <Link
              href="/auth"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[11px] uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
            >
              Start building
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 border border-border/60 px-5 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="h-px bg-border/40" />
      </div>

      {/* Anti-features */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <div className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              What we don't do
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Prohibit,
                title: "0% commission",
                desc: "Your money is your money. We don't take a cut.",
              },
              {
                icon: Eye,
                title: "No algorithms",
                desc: "No boosted listings. No pay-to-rank. Every job is visible.",
              },
              {
                icon: CurrencyDollar,
                title: "No tiers",
                desc: "One flat price for builders. Seekers post for free. That's it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 border-l-2 border-primary/20 pl-4"
              >
                <item.icon className="size-4 text-primary/70" />
                <p className="text-xs font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="h-px bg-border/40" />
      </div>

      {/* How it works */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <div className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              How it works
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Seekers */}
            <div className="flex flex-col gap-4 border border-border/40 p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70 font-medium">
                Seekers
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Post a job with real details",
                  "Builders apply with their profile",
                  "Pick someone and get to work",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="text-[10px] text-muted-foreground/30 tabular-nums font-medium pt-px">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/30 tracking-wide mt-1">
                Always free to post.
              </p>
            </div>

            {/* Builders */}
            <div className="flex flex-col gap-4 border border-border/40 p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70 font-medium">
                Builders
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Subscribe for a flat monthly fee",
                  "Browse jobs, apply to what fits",
                  "Work directly with seekers — no middleman",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="text-[10px] text-muted-foreground/30 tabular-nums font-medium pt-px">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/30 tracking-wide mt-1">
                Keep 100% of what you earn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="h-px bg-border/40" />
      </div>

      {/* Job types */}
      <section className="mx-auto w-full max-w-3xl px-4 py-20">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2 text-muted-foreground/50">
            <div className="h-px w-8 bg-primary/40" />
            <span className="text-[10px] uppercase tracking-[0.3em]">
              Real work
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Lightning,
                label: "From scratch",
                desc: "New builds, greenfield projects",
              },
              {
                icon: CheckCircle,
                label: "Join in progress",
                desc: "Jump into an existing codebase",
              },
              {
                icon: Prohibit,
                label: "Fix AI slop",
                desc: "Clean up what the robots broke",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 border border-border/40 p-4 hover:border-primary/20 transition-colors"
              >
                <item.icon className="size-3.5 text-primary/60" />
                <p className="text-xs font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground/50">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4">
        <div className="border border-border/40 p-8 flex flex-col items-center gap-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Keep every dollar you earn.
          </p>
          <p className="text-[11px] text-muted-foreground/50 max-w-sm leading-relaxed">
            Other platforms take 10–20% of every project. We charge builders one
            flat monthly fee and let seekers post for free. No commission, ever.
          </p>
          <Link
            href="/auth"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[11px] uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
          >
            Get started
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-3xl px-4 pb-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground/30">
          <div className="h-px w-6 bg-current" />
          <p className="text-[10px] uppercase tracking-[0.3em]">
            No commission. No tiers. No bullshit.
          </p>
          <div className="h-px w-6 bg-current" />
        </div>
      </footer>
    </div>
  );
}
