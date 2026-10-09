"use client";

import Link from "next/link";
import { projects } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

/** Original illustrated "screenshots" (no real product screenshots). */
function ScanFactShot() {
  const lines = [
    { w: "w-11/12" },
    { w: "w-9/12", flag: "warn" },
    { w: "w-10/12" },
    { w: "w-7/12", flag: "fail" },
    { w: "w-11/12" },
    { w: "w-8/12" },
    { w: "w-10/12", flag: "warn" },
    { w: "w-6/12" },
  ];
  return (
    <div className="space-y-2.5 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Key Fact Statement</span>
        <span className="rounded-full bg-fail-soft px-2 py-0.5 font-mono text-[9px] text-fail">3 flags</span>
      </div>
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className={`h-2 rounded-full ${l.w} ${
              l.flag === "fail" ? "bg-fail/30 ring-1 ring-fail/40" : l.flag === "warn" ? "bg-warn/25 ring-1 ring-warn/40" : "bg-ink/10"
            }`}
          />
        </div>
      ))}
      <div className="rounded-md border border-line bg-paper p-2.5">
        <p className="font-mono text-[9px] text-fail">● Hidden charge not disclosed</p>
        <p className="mt-1 font-mono text-[9px] text-warn-ink">● APR shown without fees</p>
      </div>
    </div>
  );
}

function LoanShot() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="p-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="var(--blueprint)" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#p-grid)" />
      <path d="M0 168H320" stroke="var(--ink)" strokeOpacity="0.5" />
      <rect x="112" y="64" width="96" height="104" fill="var(--brick)" stroke="var(--ink)" strokeWidth="1.2" />
      <path d="M106 64H214V56H106Z" fill="#efe7d6" stroke="var(--ink)" strokeWidth="1.2" />
      {[124, 150, 176].map((x) => (
        <rect key={x} x={x} y="78" width="18" height="30" fill="var(--glass)" stroke="var(--ink)" strokeWidth="1" />
      ))}
      <rect x="122" y="122" width="20" height="46" fill="var(--door)" stroke="var(--ink)" strokeWidth="1" />
      <rect x="156" y="124" width="38" height="28" fill="var(--glass)" stroke="var(--ink)" strokeWidth="1" />
      <circle cx="252" cy="140" r="18" fill="#6f9461" stroke="var(--ink)" strokeWidth="1" />
      <path d="M252 168v-12" stroke="#6b5440" strokeWidth="3" />
      <g fontFamily="var(--font-geist-mono)" fontSize="8" fill="var(--blueprint)">
        <text x="16" y="24">STAGE 08 · EXIT</text>
        <text x="16" y="38" fill="var(--pass)">CONSTRUCTION 100%</text>
      </g>
    </svg>
  );
}

function AppWindowCard({ p, i }: { p: (typeof projects.items)[number]; i: number }) {
  const links = [
    { label: projects.liveLabel, href: p.live },
    ...(p.github ? [{ label: projects.githubLabel, href: p.github }] : []),
  ].filter((l) => l.href !== "#"); // TODO links stay hidden until real URLs exist

  return (
    <Rise delay={0.08 * i} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(14,17,22,0.3)] motion-reduce:hover:translate-y-0">
        <div className="flex items-center gap-3 border-b border-line bg-paper/70 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-ink/15" />
            <span className="size-2 rounded-full bg-ink/15" />
            <span className="size-2 rounded-full bg-ink/15" />
          </span>
          <p className="truncate rounded-md bg-card px-2 py-0.5 font-mono text-[10.5px] text-muted">{p.url}</p>
        </div>
        <div className="h-48 overflow-hidden border-b border-line bg-paper/40">
          <div className="h-full transition-transform duration-700 ease-out group-hover:-translate-y-3 motion-reduce:group-hover:translate-y-0">
            {i === 0 ? <ScanFactShot /> : <LoanShot />}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-5 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-xl font-medium tracking-tight">{p.name}</h3>
            <p className="font-mono text-[10.5px] text-muted">{p.date}</p>
          </div>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.pitch}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <li key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink/75">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 inline-flex w-fit rounded-md bg-pass-soft px-2.5 py-1 font-mono text-[12px] text-pass">{p.metric}</p>
          {links.length > 0 && (
            <div className="mt-auto flex gap-2 pt-5">
              {links.map((l) =>
                l.href.startsWith("/") ? (
                  <Link key={l.label} href={l.href} className="rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper hover:bg-ink/85">
                    {l.label} <span aria-hidden="true">↗</span>
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium hover:border-ink/30">
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </article>
    </Rise>
  );
}

export function Projects() {
  return (
    <Section id="projects" eyebrow={projects.eyebrow} headline={projects.headline}>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((p, i) => (
          <AppWindowCard key={p.name} p={p} i={i} />
        ))}
        <Rise delay={0.16} className="h-full">
          <div className="flex h-full min-h-60 items-center justify-center rounded-2xl border border-dashed border-ink/20 p-8 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">{projects.next}</p>
          </div>
        </Rise>
      </div>
    </Section>
  );
}
