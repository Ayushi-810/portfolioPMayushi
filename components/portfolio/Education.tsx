"use client";

import { education } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

function Seal() {
  return (
    <svg viewBox="0 0 80 80" className="size-20 text-blueprint" aria-hidden="true">
      <path
        d={Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = i % 2 ? 34 : 38;
          return `${i ? "L" : "M"}${(40 + r * Math.cos(a)).toFixed(2)} ${(40 + r * Math.sin(a)).toFixed(2)}`;
        }).join("") + "Z"}
        fill="var(--blueprint-soft)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
      <text x="40" y="38" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="currentColor" letterSpacing="1">
        B.TECH
      </text>
      <text x="40" y="49" textAnchor="middle" fontSize="7" fontFamily="var(--font-geist-mono)" fill="currentColor">
        CSE
      </text>
    </svg>
  );
}

export function Education() {
  const l = education.leadership;
  return (
    <Section id="education" eyebrow={education.eyebrow} headline={education.headline}>
      <div className="mt-12 grid gap-5 lg:grid-cols-5">
        <Rise className="lg:col-span-3">
          {/* certificate: double border, paper texture, seal */}
          <div
            className="relative rounded-2xl border border-line bg-card p-2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, color-mix(in srgb, var(--ink) 2.5%, transparent) 0 1px, transparent 1px 4px)",
            }}
          >
            <div className="relative rounded-xl border-[3px] border-double border-ink/15 px-7 py-9 sm:px-10">
              <div className="absolute right-6 top-6">
                <Seal />
              </div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">Degree</p>
              <p className="mt-4 max-w-[80%] font-serif text-[30px] italic leading-tight sm:text-[34px]">{education.degree}</p>
              <p className="mt-4 text-[16px] font-medium">{education.school}</p>
              <p className="text-[14.5px] text-muted">{education.place}</p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-dashed border-line pt-5 font-mono text-[13px]">
                <span>{education.dates}</span>
                <span className="text-blueprint">{education.gpa}</span>
              </div>
            </div>
          </div>
        </Rise>
        <Rise delay={0.08} className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-line bg-card p-7">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{education.leadershipLabel}</p>
            <p className="mt-4 text-lg font-medium">{l.role}</p>
            <p className="text-[14.5px] text-muted">{l.org}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{l.text}</p>
            <p className="mt-auto pt-6 font-mono text-2xl font-medium tracking-tight">{l.stat}</p>
          </div>
        </Rise>
      </div>
    </Section>
  );
}
