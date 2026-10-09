"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { construction, page, stages } from "@/content/toorak";
import { cx } from "@/components/ui";
import { Glossary } from "./Glossary";
import { Scene } from "./scene/Scene";
import { PHASES, useConstruction } from "./useConstruction";
import { IntroPanel, StagePanel } from "./StagePanel";
import { SLIDE_COUNT, StageNav, slideLabel } from "./StageNav";

const slug = (i: number) => (i === 0 ? "intro" : `stage-${i - 1}`);
const fromHash = (h: string) => {
  const key = h.replace("#", "");
  for (let i = 0; i < SLIDE_COUNT; i++) if (slug(i) === key) return i;
  return null;
};
const clamp = (n: number) => Math.max(0, Math.min(SLIDE_COUNT - 1, n));

export function ToorakExperience() {
  const [slide, setSlide] = useState(0);
  const [replay, setReplay] = useState(0);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  // The URL hash on arrival, captured before the hash-sync effect rewrites it.
  const [initialHash] = useState(() => (typeof window === "undefined" ? "" : window.location.hash));
  const reduced = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => {
    setSlide((cur) => {
      const next = clamp(n);
      if (next !== cur) setReplay(0);
      return next;
    });
  }, []);

  // Restore the slide from the URL hash.
  useEffect(() => {
    const fromUrl = fromHash(initialHash);
    const restore = requestAnimationFrame(() => {
      if (fromUrl !== null) setSlide(fromUrl);
    });
    const onHash = () => {
      const n = fromHash(window.location.hash);
      if (n !== null) go(n);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(restore);
      window.removeEventListener("hashchange", onHash);
    };
  }, [go, initialHash]);

  // Keep the URL shareable, and start each slide's panel at the top.
  useEffect(() => {
    history.replaceState(null, "", `#${slug(slide)}`);
    panelRef.current?.scrollTo({ top: 0 });
  }, [slide]);

  // Keyboard: ←/→, PageUp/PageDown, Home/End, and space.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (glossaryOpen || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable='true']")) return;
      const onControl = !!t.closest("button, a, summary, [role='tab']");
      let delta = 0;
      if (e.key === "ArrowRight" || e.key === "PageDown") delta = 1;
      else if (e.key === "ArrowLeft" || e.key === "PageUp") delta = -1;
      else if (e.key === " " && !onControl) delta = e.shiftKey ? -1 : 1;
      else if (e.key === "Home") return (e.preventDefault(), go(0));
      else if (e.key === "End") return (e.preventDefault(), go(SLIDE_COUNT - 1));
      if (!delta) return;
      e.preventDefault();
      setSlide((cur) => {
        const next = clamp(cur + delta);
        if (next !== cur) setReplay(0);
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [glossaryOpen, go]);

  // Desktop: one wheel gesture = one stage (unless the panel itself can scroll).
  useEffect(() => {
    let locked = false;
    let acc = 0;
    let reset: ReturnType<typeof setTimeout>;
    const onWheel = (e: WheelEvent) => {
      if (glossaryOpen || !window.matchMedia("(min-width: 1024px)").matches) return;
      const panel = panelRef.current;
      if (panel && panel.contains(e.target as Node)) {
        const canDown = panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2;
        const canUp = panel.scrollTop > 2;
        if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) return;
      }
      e.preventDefault();
      if (locked) return;
      acc += e.deltaY;
      clearTimeout(reset);
      reset = setTimeout(() => (acc = 0), 180);
      if (Math.abs(acc) > 40) {
        const delta = Math.sign(acc);
        acc = 0;
        locked = true;
        setTimeout(() => (locked = false), 900);
        setSlide((cur) => {
          const next = clamp(cur + delta);
          if (next !== cur) setReplay(0);
          return next;
        });
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(reset);
    };
  }, [glossaryOpen]);

  // Swipe on the scene (mobile).
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(slide + (dx < 0 ? 1 : -1));
  };

  const stageIdx = slide - 1; // -1 intro, 0–8 stages
  const stage = stageIdx >= 0 ? stages[stageIdx] : null;
  const sceneReady = stage ? stage.sceneState.ready : true;
  const build = useConstruction(stageIdx, replay, resetKey, reduced);
  const pct = build.built > 0 ? PHASES[build.built - 1].progress : 0;
  const phaseLabel = build.built > 0 ? PHASES[build.built - 1].label : construction.notStarted;
  const startOver = () => {
    setResetKey((k) => k + 1);
    go(0);
  };

  return (
    <div className="theme">
      <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
        {/* Top bar */}
        <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-paper/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="shrink-0 rounded-md px-1.5 py-1 text-[13px] text-muted transition-colors hover:text-ink">
              <span aria-hidden="true">← </span>
              {page.backLabel}
            </Link>
            <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />
            <h1 className="hidden truncate text-[15px] font-medium tracking-tight sm:block">{page.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGlossaryOpen(true)}
              className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:border-ink/30"
            >
              {page.glossaryLabel}
            </button>
          </div>
        </header>

        <main className="flex-1 lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
          {/* Scene */}
          <div
            className="relative h-[42svh] border-b border-line bg-scene lg:h-auto lg:border-b-0 lg:border-r"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-0 p-2 sm:p-4 lg:p-8">
              <Scene stage={stageIdx} replay={replay} reduced={reduced} build={build} />
            </div>
            {!sceneReady && (
              <p className="absolute left-3 top-3 rounded-full border border-dashed border-ink/25 bg-paper/90 px-2.5 py-1 font-mono text-[10px] text-muted sm:left-5 sm:top-5">
                {page.scenePending}
              </p>
            )}
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 sm:inset-x-5 sm:bottom-5">
              <button
                type="button"
                onClick={() => setReplay((r) => r + 1)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper/90 px-2.5 py-1.5 font-mono text-[11px] text-ink transition-colors hover:border-ink/30"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
                  <path d="M3 8a5 5 0 1 0 1.5-3.5M3 2.5v2.5h2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {page.replay}
              </button>
              <button
                type="button"
                onClick={startOver}
                className="rounded-lg border border-line bg-paper/90 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                {construction.startOver}
              </button>
              {/* construction meter */}
              <div className="ml-auto w-40 rounded-lg border border-line bg-paper/90 px-2.5 py-1.5 sm:w-60">
                <p className="truncate font-mono text-[10.5px] text-ink">
                  {construction.label} <span className="tabular-nums">{pct}%</span>
                  <span className="text-muted"> · {phaseLabel}</span>
                </p>
                <div
                  role="progressbar"
                  aria-label={construction.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-valuetext={`${pct}% · ${phaseLabel}`}
                  className="mt-1 h-1 overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-full rounded-full bg-blueprint transition-[width] duration-700 ease-out motion-reduce:transition-none"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div ref={panelRef} className="lg:min-h-0 lg:overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cx(
                  "mx-auto max-w-2xl px-4 py-8 sm:px-8 lg:py-12",
                  "lg:flex lg:min-h-full lg:flex-col lg:justify-center",
                )}
              >
                {slide === 0 ? (
                  <IntroPanel />
                ) : (
                  stage && <StagePanel stage={stage} replay={replay} />
                )}
              </motion.div>
            </AnimatePresence>
            <p className="mx-auto max-w-2xl px-4 pb-8 font-mono text-[10.5px] text-muted sm:px-8">{page.footerNote}</p>
          </div>
        </main>

        <div className="sticky bottom-0 z-20 shrink-0 border-t border-line bg-paper/95 backdrop-blur-md">
          <StageNav slide={slide} go={go} />
        </div>

        <p aria-live="polite" className="sr-only">
          {slideLabel(slide)}
        </p>
      </div>

      <Glossary open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
