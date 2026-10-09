"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts from `from` to `to` once. By default it starts on mount; with `whenVisible` it waits
 * until scrolled into view. The final value is server-rendered and shown as-is under reduced motion.
 */
export function CountUp({
  from = 0,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  delay = 0,
  duration = 0.6,
  whenVisible = false,
}: {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
  whenVisible?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const final = `${prefix}${fmt(to, decimals)}${suffix}`;
  const ready = !whenVisible || inView;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    el.textContent = `${prefix}${fmt(from, decimals)}${suffix}`;
    if (!ready) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = `${prefix}${fmt(v, decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [from, to, decimals, prefix, suffix, delay, duration, reduced, ready]);

  return (
    <span ref={ref} aria-label={final}>
      {final}
    </span>
  );
}
