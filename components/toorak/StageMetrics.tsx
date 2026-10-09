"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { CountUp } from "@/components/CountUp";
import { cx } from "@/components/ui";
import { bookGrowth, page, type Metric, type MetricValue } from "@/content/toorak";

const DURATION = 0.6;
const STAGGER = 0.08;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function Fade({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="inline-block"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.span>
  );
}

const MIX_SHADES = ["bg-blueprint", "bg-blueprint/55", "bg-blueprint/25"];

function Value({ v, delay }: { v: MetricValue; delay: number }) {
  const reduced = useReducedMotion();
  switch (v.kind) {
    case "number":
      return <CountUp to={v.to} decimals={v.decimals} prefix={v.prefix} suffix={v.suffix} delay={delay} />;
    case "text":
      return <Fade delay={delay}>{v.text}</Fade>;
    case "change":
      return (
        <span className="inline-flex items-center gap-1.5">
          <span>{v.from}</span>
          <svg aria-hidden="true" viewBox="0 0 20 10" className="h-2.5 w-5 text-muted">
            <motion.path
              d="M1 5h16M13 1.5L17 5l-4 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay, ease: EASE_OUT }}
            />
          </svg>
          <span className="sr-only">to</span>
          <CountUp from={v.from} to={v.to} suffix={v.suffix} delay={delay + 0.25} />
        </span>
      );
    case "mix":
      return <Fade delay={delay}>{v.parts.map((p) => p.value).join(" / ")}</Fade>;
  }
}

function MixBar({ parts, delay }: { parts: { label: string; value: number }[]; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="mt-2.5">
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {parts.map((p, i) => (
          <motion.span
            key={p.label}
            className={cx("h-full origin-left rounded-full", MIX_SHADES[i % MIX_SHADES.length])}
            style={{ width: `${p.value}%` }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION, delay: delay + i * STAGGER, ease: EASE_OUT }}
          />
        ))}
      </div>
      <p className="mt-1.5 flex flex-wrap gap-x-3 font-mono text-[10px] text-muted">
        {parts.map((p, i) => (
          <span key={p.label} className="inline-flex items-center gap-1">
            <span aria-hidden="true" className={cx("size-1.5 rounded-full", MIX_SHADES[i % MIX_SHADES.length])} />
            {p.label} {p.value}%
          </span>
        ))}
      </p>
    </div>
  );
}

function MetricCard({ m, index, wide, last }: { m: Metric; index: number; wide: boolean; last: boolean }) {
  const meaningId = useId();
  const delay = index * STAGGER;
  return (
    <li
      tabIndex={0}
      aria-describedby={meaningId}
      className={cx(
        "group relative min-w-0 rounded-lg border border-line bg-card px-3 py-3 outline-none sm:px-4 sm:py-3.5 transition-colors hover:border-ink/25 focus-visible:border-blueprint",
        wide ? "lg:col-span-3" : "lg:col-span-2",
        // an odd card out spans the full row below desktop
        last && "col-span-2 lg:col-span-3",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[19px] font-medium leading-tight sm:text-[22px] tracking-tight tabular-nums text-ink">
          <Value v={m.value} delay={delay} />
        </p>
        {m.dot && (
          <span
            className={cx(
              "mt-1 inline-flex shrink-0 items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.1em]",
              m.dot === "control" ? "text-pass" : "text-warn-ink",
            )}
          >
            <span aria-hidden="true" className={cx("size-1.5 rounded-full", m.dot === "control" ? "bg-pass" : "bg-warn")} />
            {page.controlLabel[m.dot]}
          </span>
        )}
      </div>
      <p className="mt-1 text-[13px] font-medium leading-snug text-ink/85">{m.label}</p>
      {m.value.kind === "mix" && <MixBar parts={m.value.parts} delay={delay} />}
      {/* Meaning: always visible below lg; a tooltip on hover/focus at lg+ */}
      <p
        id={meaningId}
        role="tooltip"
        className={cx(
          "mt-1 text-[12.5px] leading-snug text-muted",
          "lg:pointer-events-none lg:absolute lg:inset-x-2 lg:top-full lg:z-20 lg:mt-1.5 lg:rounded-md lg:bg-ink lg:px-2.5 lg:py-1.5 lg:text-paper",
          "lg:translate-y-1 lg:opacity-0 lg:transition lg:duration-200 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100",
        )}
      >
        {m.meaning}
      </p>
    </li>
  );
}

/** "Stage metrics · monthly": 5 cards (3 + 2 on desktop). Re-mount (via key) to replay the count-up. */
export function StageMetrics({ metrics }: { metrics: Metric[] }) {
  return (
    <section aria-label={page.metricsLabel}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          <span aria-hidden="true" className="inline-block size-1.5 rounded-[1px] bg-blueprint" />
          {page.metricsLabel}
        </h3>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-6">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} m={m} index={i} wide={i >= 3} last={i === metrics.length - 1 && metrics.length % 2 === 1} />
        ))}
      </ul>
    </section>
  );
}

/** Exit stage: purchases + draws − payoffs = monthly growth. */
export function BookGrowth() {
  const reduced = useReducedMotion();
  const base = metricsDelay();
  return (
    <section aria-label={bookGrowth.label} className="rounded-lg border border-line bg-card px-4 py-4">
      <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{bookGrowth.label}</h3>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono tabular-nums">
        {bookGrowth.terms.map((t, i) => (
          <motion.span
            key={t.label}
            className="inline-flex items-baseline gap-1.5"
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: base + i * 0.35, ease: EASE_OUT }}
          >
            {t.sign && <span className="text-muted">{t.sign}</span>}
            <span className="text-lg font-medium text-ink">{t.value}</span>
            <span className="text-[11px] text-muted">{t.label}</span>
          </motion.span>
        ))}
        <motion.span
          className="inline-flex items-baseline gap-1.5"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: base + bookGrowth.terms.length * 0.35 }}
        >
          <span className="text-muted">=</span>
          <span className="text-lg font-medium text-blueprint">
            <CountUp
              to={bookGrowth.result.to}
              prefix={bookGrowth.result.prefix}
              suffix={bookGrowth.result.suffix}
              delay={base + bookGrowth.terms.length * 0.35 + 0.1}
            />
          </span>
          <span className="text-[11px] text-muted">{bookGrowth.result.label}</span>
        </motion.span>
      </p>
      <p className="mt-2.5 font-mono text-[11px] text-muted">{bookGrowth.caption}</p>
    </section>
  );
}

/** The equation starts once the five metric cards have counted up. */
const metricsDelay = () => 4 * STAGGER + DURATION;
