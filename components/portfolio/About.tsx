"use client";

import { CountUp } from "@/components/CountUp";
import { about } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" eyebrow={about.eyebrow} headline={about.headline}>
      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Rise className="space-y-5 lg:col-span-7">
          {about.bio.map((p) => (
            <p key={p} className="text-[18.5px] leading-relaxed text-ink/80">
              {p}
            </p>
          ))}
          <p className="flex items-center gap-2 pt-3 font-mono text-[11.5px] text-muted">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 text-blueprint">
              <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="8" cy="6.5" r="1.6" fill="currentColor" />
            </svg>
            {about.location}
          </p>
        </Rise>

        <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          {about.stats.map((s, i) => (
            <li key={s.label}>
              <Rise delay={0.08 * i}>
                <div className="flex items-baseline justify-between gap-4 rounded-xl border border-line bg-card px-5 py-5 transition-colors hover:border-ink/25 sm:block lg:flex">
                  <p className="font-mono text-4xl font-medium tracking-tight tabular-nums">
                    <CountUp to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} duration={1.1} delay={0.1 * i} whenVisible />
                  </p>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted sm:mt-2 lg:mt-0">{s.label}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
