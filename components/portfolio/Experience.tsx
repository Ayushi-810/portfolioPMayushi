"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/components/ui";
import { experience } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

export function Experience() {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = experience.tabs[active];
  const r = experience.role;

  const onKey = (e: KeyboardEvent) => {
    const n = experience.tabs.length;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section id="experience" eyebrow={experience.eyebrow} headline={experience.headline}>
      {/* role card */}
      <Rise className="mt-12">
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[17px] font-medium">{r.company}</p>
            <p className="text-[14.5px] text-muted">
              {r.title} · {r.location}
            </p>
          </div>
          <div className="font-mono text-[11.5px] text-muted sm:text-right">
            <p className="text-ink">{r.dates}</p>
            <p>{r.earlier}</p>
          </div>
        </div>
      </Rise>

      {/* tabs by team */}
      <Rise className="mt-6">
        <div
          role="tablist"
          aria-label="Work by team"
          onKeyDown={onKey}
          className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {experience.tabs.map((tab, i) => (
            <button
              key={tab.product}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cx(
                "relative shrink-0 rounded-lg border px-3.5 py-2 text-left transition-colors",
                i === active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-ink/30",
              )}
            >
              <span className={cx("block font-mono text-[10px] uppercase tracking-[0.12em]", i === active ? "text-paper/60" : "text-muted")}>
                {tab.team}
              </span>
              <span className="block text-[13.5px] font-medium">{tab.product}</span>
            </button>
          ))}
        </div>

        {/* product-window panel */}
        <div
          role="tabpanel"
          id={`${base}-panel`}
          aria-labelledby={`${base}-tab-${active}`}
          className="mt-4 overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(14,17,22,0.04),0_24px_48px_-28px_rgba(14,17,22,0.22)]"
        >
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-paper/70 px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
            </span>
            <p className="font-mono text-[11.5px] text-muted">{t.product}</p>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">{t.period}</span>
            <Link
              href={`/how-toorak-works#stage-${t.stage}`}
              className="ml-auto rounded-full border border-blueprint/30 bg-blueprint-soft px-2.5 py-0.5 font-mono text-[10.5px] text-blueprint transition-colors hover:border-blueprint/60"
            >
              {experience.labels.stage} {String(t.stage).padStart(2, "0")} →
            </Link>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[1.4fr_1fr]"
            >
              <div>
                <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{experience.labels.did}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-ink/85">{t.did}</p>
              </div>
              <div>
                <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{experience.labels.impact}</h3>
                <ul className="mt-3 space-y-2">
                  {t.impact.map((m) => (
                    <li key={m} className="rounded-lg border border-line bg-paper/60 px-4 py-3 font-mono text-[17px] font-medium tracking-tight">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Rise>

      {/* earlier */}
      <Rise className="mt-16">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{experience.earlierLabel}</h3>
        <ol className="mt-6 space-y-8 border-l border-line pl-6">
          {experience.earlier.map((job) => (
            <li key={job.company} className="relative">
              <span aria-hidden="true" className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-paper bg-blueprint ring-1 ring-blueprint/30" />
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                {job.dates} · {job.location}
              </p>
              <p className="mt-1.5 text-lg font-medium">
                {job.role} <span className="text-muted">at</span> {job.company}
              </p>
              <ul className="mt-2 space-y-1">
                {job.points.map((p) => (
                  <li key={p} className="text-[15px] leading-relaxed text-muted">
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Rise>
    </Section>
  );
}
