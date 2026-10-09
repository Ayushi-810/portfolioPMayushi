"use client";

import { motion, type Transition } from "framer-motion";
import { createContext, useContext, type ReactNode, type SVGProps } from "react";

const ReducedCtx = createContext(false);

export function ReducedProvider({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  return <ReducedCtx.Provider value={reduced}>{children}</ReducedCtx.Provider>;
}

export const useReduced = () => useContext(ReducedCtx);

const EASE = [0.22, 1, 0.36, 1] as const;

/** Slow, smooth default transition. Collapses to instant under prefers-reduced-motion. */
export function useTr() {
  const reduced = useReduced();
  return (o: Transition = {}): Transition => (reduced ? { duration: 0 } : { duration: 1.1, ease: EASE, ...o });
}

type PathProps = Omit<SVGProps<SVGPathElement>, "ref" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> & {
  delay?: number;
  duration?: number;
};

/** A stroke that draws itself in. */
export function DrawPath({ delay = 0, duration = 1.4, ...rest }: PathProps) {
  const tr = useTr();
  const reduced = useReduced();
  return (
    <motion.path
      {...(rest as object)}
      fill={rest.fill ?? "none"}
      strokeLinecap={rest.strokeLinecap ?? "round"}
      strokeLinejoin={rest.strokeLinejoin ?? "round"}
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={tr({ duration, delay, opacity: { duration: 0.2, delay } })}
    />
  );
}

/** A group that fades (and optionally rises) in. */
export function FadeIn({
  delay = 0,
  duration = 0.8,
  y = 0,
  x = 0,
  scale,
  children,
  className,
}: {
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  children: ReactNode;
  className?: string;
}) {
  const tr = useTr();
  const reduced = useReduced();
  return (
    <motion.g
      className={className}
      initial={reduced ? false : { opacity: 0, y, x, scale: scale ?? 1 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={tr({ duration, delay })}
    >
      {children}
    </motion.g>
  );
}

export const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };
