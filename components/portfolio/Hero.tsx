"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eyebrow, cx } from "@/components/ui";
import { hero } from "@/content/portfolio";
import { usePage } from "./page-state";

const EASE = [0.22, 1, 0.36, 1] as const;
const toneClass = { pass: "text-pass", info: "text-blueprint", warn: "text-warn-ink" } as const;

function RotatingWord({ words, paused }: { words: string[]; paused: boolean }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2500);
    return () => clearInterval(id);
  }, [paused, reduced, words.length]);
  return (
    <span className="relative inline-block" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.em
          key={words[i]}
          className="inline-block font-serif text-[1.12em] font-normal italic text-blueprint"
          initial={{ y: "0.3em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.3em", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {words[i]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

function ProductLog({ start }: { start: boolean }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!start || shown >= hero.log.length) return;
    // one line at a time
    const id = setTimeout(() => setShown((n) => n + 1), reduced ? 0 : 520);
    return () => clearTimeout(id);
  }, [start, shown, reduced]);

  return (
    <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-line bg-card text-left shadow-[0_1px_2px_rgba(14,17,22,0.04),0_30px_60px_-30px_rgba(14,17,22,0.25)]">
      <div className="flex items-center gap-3 border-b border-line bg-paper/70 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </span>
        <p className="font-mono text-[11.5px] text-muted">{hero.logTitle}</p>
        <p className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-pass">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-pass opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-pass" />
          </span>
          live
        </p>
      </div>
      <ol className="space-y-1.5 px-5 py-5 font-mono text-[12.5px] sm:text-[13.5px]" aria-label="Recent work">
        {hero.log.map((l, i) => (
          <motion.li
            key={l.text}
            className="flex gap-4"
            initial={false}
            animate={{ opacity: i < shown ? 1 : 0, x: i < shown ? 0 : -6 }}
            transition={{ duration: 0.35 }}
          >
            <span className="w-5 shrink-0 text-right tabular-nums text-ink/25">{String(i + 1).padStart(2, "0")}</span>
            <span className={cx("w-[5.5rem] shrink-0", toneClass[l.tone])}>{l.verb}</span>
            <span className="text-ink/85">{l.text}</span>
          </motion.li>
        ))}
        <li className="flex gap-4" aria-hidden="true">
          <span className="w-5 shrink-0 text-right text-ink/25">$</span>
          <span className="caret inline-block h-[1.05em] w-[7px] translate-y-[0.15em] bg-ink/70" />
        </li>
      </ol>
    </div>
  );
}

export function Hero() {
  const { intro } = usePage();
  const [hover, setHover] = useState(false);
  const flipped = intro === "done";

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* blueprint grid + soft glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--blueprint) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--blueprint) 7%, transparent) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blueprint/10 blur-3xl transition-colors duration-700"
      />

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28">
        <Eyebrow className="justify-center">{hero.eyebrow}</Eyebrow>

        <div className="mt-6 [perspective:1200px]">
          <motion.h1
            id="hero-title"
            className="hero-mirror mx-auto max-w-4xl text-[2.6rem] font-medium leading-[1.04] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[4.6rem]"
            initial={false}
            animate={{ rotateY: flipped ? 0 : 180 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <span className="sr-only">
              {hero.headline.pre}
              {hero.headline.rotating.join(", ")}
            </span>
            <span aria-hidden="true">{hero.headline.pre}</span>
            <RotatingWord words={hero.headline.rotating} paused={hover || !flipped} />
          </motion.h1>
        </div>
        <motion.p
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          initial={false}
          animate={{ opacity: flipped ? 1 : 0 }}
          transition={{ duration: 0.5, delay: flipped ? 0.5 : 0 }}
        >
          {hero.caption}
        </motion.p>

        <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-muted">{hero.sub}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={hero.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
          >
            {hero.primaryCta.label} <span aria-hidden="true">↓</span>
          </a>
          <Link
            href={hero.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink/30"
          >
            {hero.secondaryCta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ProductLog start={flipped} />
      </div>
    </section>
  );
}
