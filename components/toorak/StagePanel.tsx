"use client";

import { motion } from "framer-motion";
import { AccentText, Eyebrow, cx } from "@/components/ui";
import { page, primer, sources, type SourceId, type Stage } from "@/content/toorak";
import { DealTracker } from "./DealTracker";
import { ProductToggle } from "./ProductToggle";
import { BookGrowth, StageMetrics } from "./StageMetrics";


const sourceNo = (id: SourceId) => sources.findIndex((s) => s.id === id) + 1;

function Cite({ id }: { id: SourceId }) {
  const n = sourceNo(id);
  return (
    <sup className="ml-0.5 font-mono text-[9px]">
      <a href={`#source-${n}`} aria-label={`Source ${n}`} className="text-blueprint hover:underline">
        [{n}]
      </a>
    </sup>
  );
}

function Sources() {
  return (
    <ol className="mt-6 space-y-1 border-t border-line pt-4 font-mono text-[10.5px] leading-relaxed text-muted">
      {sources.map((s, i) => (
        <li key={s.id} id={`source-${i + 1}`}>
          [{i + 1}]{" "}
          <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-ink">
            {s.label}
          </a>
          , {s.date}
        </li>
      ))}
    </ol>
  );
}

const Headline = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className={cx(
      "mt-4 font-medium leading-[1.05] tracking-[-0.03em] text-balance",
      "text-4xl sm:text-5xl xl:text-[3.4rem]",
    )}
  >
    {children}
  </h2>
);

/* ───────── Intro: Toorak in 30 seconds ───────── */

export function IntroPanel() {
  return (
    <article aria-labelledby="intro-title">
      <Eyebrow>{primer.eyebrow}</Eyebrow>
      <Headline id="intro-title">
        <AccentText text={primer.headline} />
      </Headline>
      <p className="mt-5 text-[17px] leading-relaxed text-ink/85">{primer.oneBreath}</p>

      <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-5 sm:grid-cols-4">
        {primer.stats.map((s) => (
          <li key={s.label}>
            <p className="font-mono text-2xl font-medium tracking-tight">
              {s.value}
              <Cite id={s.source} />
            </p>
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{s.label}</p>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[14px] text-muted">
        {primer.facts.map((f) => (
          <span key={f.text} className="mr-2">
            {f.text}
            <Cite id={f.source} />
          </span>
        ))}
      </p>

      <aside className="mt-6 rounded-xl border border-line bg-card px-4 py-3.5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-blueprint">{primer.today.label}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink/85">
          {primer.today.text}
          <Cite id={primer.today.source} />
        </p>
      </aside>

      <p className="mt-6 hidden font-mono text-[11px] text-muted lg:block">{primer.cta}</p>
      <Sources />
    </article>
  );
}

/* ───────── A stage ───────── */

export function StagePanel({ stage, replay }: { stage: Stage; replay: number }) {
  const titleId = `${stage.id}-title`;
  return (
    <article aria-labelledby={titleId}>
      <Eyebrow>{stage.eyebrow}</Eyebrow>
      <Headline id={titleId}>
        <AccentText text={stage.headline} />
      </Headline>

      <div className={"mt-5 space-y-3 text-[17.5px] leading-relaxed text-ink/85"}>
        {stage.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {stage.points && (
        <ol className="mt-5 divide-y divide-line border-y border-line">
          {stage.points.map((pt, i) => (
            <li
              key={pt.label}
              className={cx(
                "grid grid-cols-[1.75rem_1fr] gap-x-2 py-3",
                pt.highlight && "-mx-3 rounded-lg border-l-2 border-blueprint bg-blueprint-soft/60 px-3",
              )}
            >
              <span className="font-mono text-[11px] leading-6 text-blueprint">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-medium leading-6">
                  {pt.label}
                  {pt.highlight && (
                    <span className="rounded-full bg-blueprint px-2 py-px font-mono text-[9.5px] uppercase tracking-[0.08em] text-white">
                      Maria’s loan
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[14.5px] leading-relaxed text-muted">{pt.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <motion.div
        key={stage.id}
        className="mt-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <DealTracker rows={stage.dealTracker} />
      </motion.div>

      {stage.id === "property" && (
        <div className="mt-4">
          <ProductToggle />
        </div>
      )}

      {stage.metrics && (
        <div key={replay} className="mt-6 space-y-3">
          <StageMetrics metrics={stage.metrics} />
          {stage.id === "exit" && <BookGrowth />}
        </div>
      )}

      {stage.chips && (
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <p className="mr-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{page.chipsLabel}</p>
          {stage.chips.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="rounded-md border border-line bg-card px-2 py-0.5 font-mono text-[11px] text-ink/75 transition-colors hover:border-blueprint/40 hover:text-blueprint"
            >
              {c.label}
            </a>
          ))}
        </div>
      )}

    </article>
  );
}
