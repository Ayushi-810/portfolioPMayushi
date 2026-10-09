"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { Character } from "@/components/Character";
import { stages, type Pose } from "@/content/toorak";
import { PHASES, type Construction } from "../useConstruction";
import { ReducedProvider } from "./anim";
import { DrawTimeline } from "./DrawTimeline";
import { ChannelsProp, ListingProp } from "./props";
import { Context, Rowhouse, SceneDefs } from "./Rowhouse";

const OFFSTAGE = -60;

/** Overall progress 0–1, weighted by each phase's share of the meter. */
function useWarmth(progress: Construction["progress"]) {
  return useTransform(progress, (v: number[]) =>
    v.reduce((sum, p, i) => sum + p * (PHASES[i].progress - (i ? PHASES[i - 1].progress : 0)), 0) / 100,
  );
}

/**
 * `stage` is -1 for the intro, 0–8 for the stages. The house comes from the construction engine;
 * `replay` also re-mounts the stage's props so their animation plays again.
 */
export function Scene({
  stage,
  replay,
  reduced,
  build,
}: {
  stage: number;
  replay: number;
  reduced: boolean;
  build: Construction;
}) {
  const s = stage >= 0 ? stages[stage] : null;
  const warmth = useWarmth(build.progress);

  // The builder works on whichever phase is being built, otherwise rests at the last one finished.
  const phase = build.working ?? (build.built > 0 && stage >= 1 ? build.built - 1 : null);
  const pose: Pose = !s ? "idle" : phase !== null ? PHASES[phase].pose : s.sceneState.pose;
  const targetX = !s ? OFFSTAGE : phase !== null ? PHASES[phase].builderX : s.sceneState.builderX;

  const x = useMotionValue(reduced ? targetX : OFFSTAGE);
  const prevStage = useRef(stage);

  useEffect(() => {
    const entering = stage === 0 && (prevStage.current < 0 || replay > 0);
    prevStage.current = stage;
    if (reduced) {
      x.set(targetX);
      return;
    }
    if (entering) x.set(OFFSTAGE);
    const distance = Math.abs(x.get() - targetX);
    const controls = animate(x, targetX, {
      duration: entering ? 2.4 : Math.min(1.6, 0.4 + distance / 220),
      ease: [0.45, 0, 0.25, 1],
    });
    return () => controls.stop();
  }, [targetX, stage, replay, reduced, x]);

  const prop =
    s?.sceneState.props === "listing" ? (
      <ListingProp />
    ) : s?.sceneState.props === "channels" ? (
      <ChannelsProp />
    ) : s?.sceneState.props === "draws" ? (
      <DrawTimeline draws={build.draws} />
    ) : null;
  // the draw timeline is driven live by the engine, so it isn't re-mounted on replay
  const propKey = s?.sceneState.props === "draws" ? `${stage}` : `${stage}-${replay}`;

  const label = build.built > 0 ? PHASES[build.built - 1].label.toLowerCase() : "not started";

  return (
    <ReducedProvider reduced={reduced}>
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label={`A 1920s rowhouse under renovation, with a builder beside it. Construction: ${label}.`}
      >
        <SceneDefs />
        <Context />
        <Rowhouse phases={build.progress} warmth={warmth} />
        <AnimatePresence mode="wait">
          {prop && (
            <motion.g key={propKey} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              {prop}
            </motion.g>
          )}
        </AnimatePresence>
        <Character x={x} pose={pose} facing={1} reduced={reduced} groundY={540} scale={1.32} />
      </svg>
    </ReducedProvider>
  );
}
