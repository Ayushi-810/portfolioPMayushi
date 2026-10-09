"use client";

import { animate, motionValue, type AnimationPlaybackControls, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { construction } from "@/content/toorak";

export const PHASES = construction.phases;
const DRAW_COUNT = PHASES.filter((p) => p.draw).length;

/** 0 idle · 1 requested · 2 inspecting · 3 lien waiver cleared · 4 wired */
export type DrawStep = 0 | 1 | 2 | 3 | 4;

const FULL = 2.4; // a stage's own phase
const FAST = 0.4; // skipped phases when jumping ahead
const UNDO = 0.9; // reversing the stage you just left
const UNDO_FAST = 0.3;
const EASE = [0.45, 0, 0.25, 1] as const;

/** Number of phases that should be built at a given stage (-1 = intro). */
export const phasesBuiltAt = (stage: number) => PHASES.filter((p) => p.stage <= stage).length;
const ownPhase = (i: number, stage: number) => PHASES[i].stage === stage;
const drawIndex = (i: number) => (PHASES[i].draw ? PHASES[i].draw! - 1 : -1);

export type Construction = {
  /** 0→1 per phase. */
  progress: MotionValue<number>[];
  /** Phases fully finished (drives the meter label). */
  built: number;
  /** Phase currently animating, if any. */
  working: number | null;
  draws: DrawStep[];
};

/**
 * Sequences the house build. Forward: skipped phases build fast, the stage's own phase(s) build
 * slowly; in stage 6 each draw's request → inspect → waiver → wired cycle triggers its phase.
 * Backward: phases above the target reverse, newest first. `replay` rebuilds the stage's own
 * phases; `resetKey` (Start over) clears everything instantly.
 */
export function useConstruction(stage: number, replay: number, resetKey: number, reduced: boolean): Construction {
  const [progress] = useState(() => PHASES.map(() => motionValue(0)));
  const [built, setBuilt] = useState(0);
  const [working, setWorking] = useState<number | null>(null);
  const [draws, setDraws] = useState<DrawStep[]>(() => Array(DRAW_COUNT).fill(0));
  const last = useRef({ stage, replay, resetKey });

  useEffect(() => {
    const target = phasesBuiltAt(stage);
    let cancelled = false;
    let ctl: AnimationPlaybackControls | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const setDraw = (k: number, step: DrawStep) =>
      setDraws((d) => (d[k] === step ? d : d.map((v, j) => (j === k ? step : v))));
    const sleep = (ms: number) => new Promise<void>((r) => (timer = setTimeout(r, ms)));
    const tween = (i: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        if (progress[i].get() === to) return resolve();
        ctl = animate(progress[i], to, { duration, ease: EASE, onComplete: resolve });
      });

    (async () => {
      await Promise.resolve(); // keep state updates out of the effect body
      if (cancelled) return;
      const prev = last.current;
      last.current = { stage, replay, resetKey };

      if (reduced) {
        progress.forEach((mv, i) => mv.set(i < target ? 1 : 0));
        setDraws(PHASES.filter((p) => p.draw).map((p) => (PHASES.indexOf(p) < target ? 4 : 0)) as DrawStep[]);
        setBuilt(target);
        setWorking(null);
        return;
      }

      if (resetKey !== prev.resetKey) {
        progress.forEach((mv) => mv.set(0));
        setDraws(Array(DRAW_COUNT).fill(0));
        setBuilt(0);
      }

      // Replay: clear this stage's own phases, then rebuild them below.
      if (replay !== prev.replay && replay > 0) {
        PHASES.forEach((_, i) => {
          if (ownPhase(i, stage)) {
            progress[i].set(0);
            if (drawIndex(i) >= 0) setDraw(drawIndex(i), 0);
          }
        });
        const first = PHASES.findIndex((p) => p.stage === stage);
        if (first >= 0) setBuilt(first);
      }

      // Going back: reverse phases above the target, newest first.
      for (let i = PHASES.length - 1; i >= target; i--) {
        if (progress[i].get() === 0) continue;
        setWorking(i);
        await tween(i, 0, PHASES[i].stage === prev.stage ? UNDO : UNDO_FAST);
        if (cancelled) return;
        if (drawIndex(i) >= 0) setDraw(drawIndex(i), 0);
        setBuilt(i);
      }

      // Going forward: build every missing phase up to the target.
      for (let i = 0; i < target; i++) {
        if (progress[i].get() === 1) continue;
        const own = ownPhase(i, stage);
        const k = drawIndex(i);
        if (k >= 0 && own) {
          // The draw cycle; the build starts on "wired".
          setWorking(i);
          setDraw(k, 1);
          await sleep(550);
          if (cancelled) return;
          setDraw(k, 2);
          await sleep(900);
          if (cancelled) return;
          setDraw(k, 3);
          await sleep(450);
          if (cancelled) return;
          setDraw(k, 4);
        } else if (k >= 0) {
          setDraw(k, 4);
        }
        setWorking(i);
        await tween(i, 1, own ? FULL : FAST);
        if (cancelled) return;
        setBuilt(i + 1);
      }
      setBuilt(target);
      setWorking(null);
    })();

    return () => {
      cancelled = true;
      ctl?.stop();
      clearTimeout(timer);
    };
  }, [stage, replay, resetKey, reduced, progress]);

  return { progress, built, working, draws };
}
