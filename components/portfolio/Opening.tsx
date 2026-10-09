"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cx } from "@/components/ui";
import { opening } from "@/content/portfolio";
import { usePage } from "./page-state";

type Phase = "loop" | "type1" | "glitch" | "flood" | "type2" | "exit";

const BASE_STEP = 360; // ms per log line on the first loop; each loop is ~30% faster
const SPEEDUP = 0.7;
const L1 = opening.line1;
const L2 = opening.line2;
const L2_LEN = (L2.pre ?? "").length + L2.accent.length + (L2.post ?? "").length;

/** Renders the first `n` characters of line 2, keeping the accent word styled. */
function Line2({ n }: { n: number }) {
  const pre = L2.pre ?? "";
  const post = L2.post ?? "";
  const a = Math.max(0, Math.min(L2.accent.length, n - pre.length));
  const b = Math.max(0, n - pre.length - L2.accent.length);
  return (
    <>
      {pre.slice(0, n)}
      {a > 0 && <em className="font-serif text-[1.12em] font-normal italic text-blueprint">{L2.accent.slice(0, a)}</em>}
      {post.slice(0, b)}
    </>
  );
}

function Clock({ turns, step }: { turns: number; step: number }) {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 5v2M16 25v2M5 16h2M25 16h2" stroke="currentColor" strokeWidth="1.2" />
      <motion.line
        x1="16"
        y1="16"
        x2="16"
        y2="7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "16px", originY: "16px" }}
        animate={{ rotate: turns * 60 }}
        transition={{ duration: step / 1000, ease: "linear" }}
      />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

function OpeningSequence() {
  const { finishIntro } = usePage();
  const [phase, setPhase] = useState<Phase>("loop");
  const [loop, setLoop] = useState(0);
  const [line, setLine] = useState(0);
  const [ticks, setTicks] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      await sleep(250);
      for (let l = 0; l < opening.loops; l++) {
        const step = BASE_STEP * Math.pow(SPEEDUP, l);
        for (let i = 0; i < opening.log.length; i++) {
          if (cancelled) return;
          setLoop(l);
          setLine(i);
          setTicks((t) => t + 1);
          await sleep(step);
        }
      }
      if (cancelled) return;
      setPhase("type1");
      for (let c = 1; c <= L1.length; c++) {
        if (cancelled) return;
        setTyped(c);
        await sleep(32);
      }
      await sleep(750);
      if (cancelled) return;
      setPhase("glitch");
      await sleep(540);
      if (cancelled) return;
      setPhase("flood");
      for (let c = L1.length; c >= 0; c -= 2) {
        if (cancelled) return;
        setTyped(Math.max(0, c));
        await sleep(14);
      }
      setPhase("type2");
      for (let c = 1; c <= L2_LEN; c++) {
        if (cancelled) return;
        setTyped(c);
        await sleep(44);
      }
      await sleep(1100);
      if (cancelled) return;
      setPhase("exit");
      await sleep(650);
      if (!cancelled) finishIntro();
    })();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finishIntro();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [finishIntro]);

  const colored = phase === "flood" || phase === "type2" || phase === "exit";
  const step = BASE_STEP * Math.pow(SPEEDUP, loop);
  const showLog = phase === "loop";

  return (
    <motion.div
      animate={{ opacity: phase === "exit" ? 0 : 1, y: phase === "exit" ? -12 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cx("absolute inset-0", phase === "glitch" && "frame-skip")}
    >
      {/* colour floods in from the centre */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-paper"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 50%, color-mix(in srgb, var(--blueprint) 10%, transparent), transparent 70%)",
        }}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: colored ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* corner clock + day counter */}
      <div className={cx("absolute left-5 top-5 flex items-center gap-2.5 transition-colors duration-700 sm:left-8 sm:top-7", colored ? "text-ink" : "text-[#6f6f6c]")}>
        <Clock turns={ticks} step={step} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]">
          {opening.dayLabel} {String(loop + 1).padStart(2, "0")}
        </p>
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        {/* the day log */}
        <motion.ol
          aria-hidden="true"
          animate={{ opacity: showLog ? 1 : 0, y: showLog ? 0 : -16 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xs font-mono text-[15px] sm:text-[17px]"
        >
          {opening.log.map((row, i) => {
            const on = i === line;
            return (
              <li
                key={row.time}
                className={cx(
                  "flex items-center gap-4 rounded-md px-3 py-1.5 transition-colors duration-150",
                  on ? "bg-[#d9d9d5] text-[#1f1f1f]" : "text-[#a3a39f]",
                )}
              >
                <span className="w-3 text-[11px]">{on ? "▸" : ""}</span>
                <span className="tabular-nums">{row.time}</span>
                <span>{row.text}</span>
              </li>
            );
          })}
        </motion.ol>

        {/* the line that gets typed, glitched, then retyped */}
        {phase !== "loop" && (
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center">
            <p
              aria-live="polite"
              className={cx(
                "relative mx-auto max-w-3xl text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] sm:text-6xl",
                colored ? "text-ink" : "text-[#2b2b2b]",
              )}
            >
              {phase === "type2" || (phase === "exit" && typed > 0) ? <Line2 n={typed} /> : L1.slice(0, typed)}
              <span aria-hidden="true" className="caret ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-current" />
              {phase === "glitch" && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                  {[
                    "inset(8% 0 62% 0)",
                    "inset(44% 0 30% 0)",
                    "inset(74% 0 6% 0)",
                  ].map((clip, i) => (
                    <span
                      key={clip}
                      className="glitch-slice absolute inset-0 bg-[#e9e9e6]"
                      style={{ clipPath: clip, animationDelay: `${i * 40}ms` }}
                    >
                      {L1}
                    </span>
                  ))}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** First visit per session: a gray routine loop that breaks into colour. Skippable. */
export function Opening() {
  const { intro, finishIntro } = usePage();
  return (
    <AnimatePresence>
      {intro !== "done" && (
        <motion.div
          key="opening"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="opening fixed inset-0 z-[60] overflow-hidden bg-[#e9e9e6]"
          style={{
            backgroundImage:
              "linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          role="region"
          aria-label="Intro"
        >
          {intro === "playing" && <OpeningSequence />}
          <button
            type="button"
            onClick={finishIntro}
            className="absolute right-5 top-5 z-10 rounded-full border border-ink/15 bg-paper/80 px-3.5 py-1.5 font-mono text-[12px] text-ink backdrop-blur transition-colors hover:border-ink/40 sm:right-8 sm:top-6"
          >
            {opening.skip} <span aria-hidden="true">→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
