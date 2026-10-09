"use client";

import { caseStudies } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

export function CaseStudies() {
  return (
    <Section id="case-studies" eyebrow={caseStudies.eyebrow} headline={caseStudies.headline}>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {caseStudies.items.map((c, i) => (
          <Rise key={c.title} delay={0.08 * i} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition-colors hover:border-ink/25 sm:p-7">
              {/* report header */}
              <div className="flex items-center justify-between gap-3 border-b border-dashed border-line pb-4">
                <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
                  <span aria-hidden="true" className="inline-block size-1.5 rounded-[1px] bg-blueprint" />
                  {c.type} report
                </p>
                <p className="font-mono text-[11px] text-muted">{c.date}</p>
              </div>
              <h3 className="mt-5 text-2xl font-medium tracking-tight">{c.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{c.finding}</p>
              <ul className="mt-6 grid grid-cols-3 gap-2">
                {c.stats.map((s) => {
                  const [num, ...rest] = s.split(" ");
                  return (
                    <li key={s} className="rounded-lg border border-line bg-paper/60 px-3 py-3">
                      <p className="font-mono text-xl font-medium tracking-tight">{num}</p>
                      <p className="mt-1 text-[12px] leading-snug text-muted">{rest.join(" ")}</p>
                    </li>
                  );
                })}
              </ul>
              {c.href !== "#" && (
                <a href={c.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-blueprint hover:underline">
                  {caseStudies.read} <span aria-hidden="true">→</span>
                </a>
              )}
            </article>
          </Rise>
        ))}
      </div>
    </Section>
  );
}
