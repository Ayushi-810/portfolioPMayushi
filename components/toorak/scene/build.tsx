"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { createContext, useContext, type ElementType, type ReactNode } from "react";

/*
 * One construction phase = one MotionValue 0→1.
 *   0.00–0.55 outlines draw in · 0.45–0.90 colour fills · 0.85–1.00 dust puff
 * Reversing the value un-builds the phase in the opposite order.
 */

type PhaseValues = { draw: MotionValue<number>; fill: MotionValue<number>; p: MotionValue<number> };
const PhaseCtx = createContext<PhaseValues | null>(null);
const usePhase = () => useContext(PhaseCtx)!;

export function Phase({ p, children }: { p: MotionValue<number>; children: ReactNode }) {
  const draw = useTransform(p, [0, 0.55], [0, 1]);
  const fill = useTransform(p, [0.45, 0.9], [0, 1]);
  const visible = useTransform(p, (v) => (v > 0.002 ? 1 : 0));
  return (
    <PhaseCtx.Provider value={{ draw, fill, p }}>
      <motion.g style={{ opacity: visible }}>{children}</motion.g>
    </PhaseCtx.Provider>
  );
}

const M = {
  path: motion.path,
  rect: motion.rect,
  circle: motion.circle,
  line: motion.line,
  polygon: motion.polygon,
  ellipse: motion.ellipse,
} as const;

type ShapeProps = { as?: keyof typeof M; fill?: string; stroke?: string; sw?: number } & Record<string, string | number | undefined>;

/** Outline draws in, then the fill fades in. */
export function S({ as = "path", fill, stroke = "var(--ink)", sw = 1.1, ...attrs }: ShapeProps) {
  const { draw, fill: fillMv } = usePhase();
  const El = M[as] as ElementType;
  return (
    <>
      {fill && <El {...attrs} fill={fill} stroke="none" style={{ opacity: fillMv }} />}
      {stroke !== "none" && (
        <El
          {...attrs}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: draw }}
        />
      )}
    </>
  );
}

/** Detail that fades in with the phase's fill (dashed lines, text, glows). */
export function Fill({ children }: { children: ReactNode }) {
  const { fill } = usePhase();
  return <motion.g style={{ opacity: fill }}>{children}</motion.g>;
}

/** Something that goes away as phase `p` builds (weeds, boards, broken cornice…). */
export function Gone({ p, children, drop = 0 }: { p: MotionValue<number>; children: ReactNode; drop?: number }) {
  const opacity = useTransform(p, [0, 0.6], [1, 0]);
  const y = useTransform(p, [0, 0.6], [0, drop]);
  return <motion.g style={{ opacity, y }}>{children}</motion.g>;
}

/** Visible while built, fading out as a later phase `until` builds (scaffolding, plan lines…). */
export function Until({ until, children, drop = 0 }: { until: MotionValue<number>; children: ReactNode; drop?: number }) {
  return (
    <Gone p={until} drop={drop}>
      {children}
    </Gone>
  );
}

/** A subtle dust puff as the phase completes. */
export function Dust({ p, x, y }: { p: MotionValue<number>; x: number; y: number }) {
  const opacity = useTransform(p, [0.82, 0.9, 1], [0, 0.55, 0]);
  const scale = useTransform(p, [0.82, 1], [0.4, 1.5]);
  return (
    <motion.g style={{ opacity, scale, x, y }} aria-hidden="true">
      <circle cx="-14" cy="2" r="7" fill="#d9d4c8" />
      <circle cx="0" cy="-4" r="9" fill="#e2ddd2" />
      <circle cx="15" cy="1" r="6.5" fill="#d9d4c8" />
      <circle cx="6" cy="6" r="5" fill="#e7e3da" />
    </motion.g>
  );
}

/** Reveals children left→right (pour) or bottom→top (rise) as `p` goes 0.25→0.9. */
export function Reveal({
  p,
  x,
  y,
  w,
  h,
  dir,
  id,
  children,
}: {
  p: MotionValue<number>;
  x: number;
  y: number;
  w: number;
  h: number;
  dir: "right" | "up";
  id: string;
  children: ReactNode;
}) {
  const t = useTransform(p, [0.25, 0.9], [0, 1], { clamp: true });
  const width = useTransform(t, (v) => (dir === "right" ? v * w : w));
  const height = useTransform(t, (v) => (dir === "up" ? v * h : h));
  const top = useTransform(t, (v) => (dir === "up" ? y + h - v * h : y));
  return (
    <>
      <defs>
        <clipPath id={id}>
          <motion.rect x={x} y={top} width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
}
