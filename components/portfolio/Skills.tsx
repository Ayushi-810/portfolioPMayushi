"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "@/components/CountUp";
import { skills } from "@/content/portfolio";
import { Rise } from "./page-state";
import { Section } from "./Section";

const TOTAL = skills.groups.reduce((n, g) => n + g.items.length, 0);

function Stamp({ order, run }: { order: number; run: boolean }) {
  return (
    <motion.span
      className="inline-block rotate-[-4deg] rounded border-[1.5px] border-pass px-1.5 py-px font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-pass"
      initial={{ opacity: 0, scale: 1.8 }}
      animate={run ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.8 }}
      transition={{ duration: 0.28, delay: 0.25 + order * 0.045, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {skills.passLabel}
    </motion.span>
  );
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  let order = 0;

  return (
    <Section id="skills" eyebrow={skills.eyebrow} headline={skills.headline}>
      <div ref={ref} className="mt-12 grid gap-5 md:grid-cols-2">
        {skills.groups.map((g, gi) => (
          <Rise key={g.name} delay={0.06 * gi}>
            <table className="w-full overflow-hidden rounded-xl border border-line bg-card text-left">
              <caption className="sr-only">{g.name} skills</caption>
              <thead>
                <tr className="border-b border-line bg-paper/60">
                  <th scope="col" className="px-4 py-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-muted">
                    {g.name}
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-muted">
                    {g.items.length} tests
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {g.items.map((s) => (
                  <tr key={s}>
                    <td className="px-4 py-2.5 text-[14.5px]">{s}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Stamp order={order++} run={run} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Rise>
        ))}
      </div>
      <Rise className="mt-6">
        <p className="inline-flex items-center gap-3 rounded-full border border-pass/30 bg-pass-soft px-4 py-2 font-mono text-[13px] text-pass">
          <span aria-hidden="true">✓</span>
          <span>
            <CountUp to={TOTAL} duration={1.2} delay={0.4} whenVisible /> / {TOTAL} {skills.summary}
          </span>
        </p>
      </Rise>
    </Section>
  );
}
