"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Accent, Stat } from "@/content/portfolio";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted", className)}>
      <span aria-hidden="true" className="inline-block size-1.5 rounded-[1px] bg-blueprint" />
      {children}
    </p>
  );
}

/** Headline with one italic serif accent phrase. */
export function AccentText({ text }: { text: Accent }) {
  return (
    <>
      {text.pre}
      <em className="font-serif text-[1.12em] font-normal italic tracking-[-0.01em]">{text.accent}</em>
      {text.post}
    </>
  );
}

export function StatBlock({ stat, className }: { stat: Stat; className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono text-2xl font-medium tracking-tight text-ink sm:text-3xl">{stat.value}</p>
      <p className="mt-1 font-mono text-[10.5px] uppercase leading-snug tracking-[0.08em] text-muted">{stat.label}</p>
    </div>
  );
}

export function Card({ children, className, as: As = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "li" }) {
  return (
    <As
      className={cx(
        "rounded-xl border border-line bg-card shadow-[0_1px_2px_rgba(14,17,22,0.04),0_10px_28px_-16px_rgba(14,17,22,0.12)]",
        className,
      )}
    >
      {children}
    </As>
  );
}

export function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "new" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] leading-5",
        tone === "new" ? "border-blueprint/30 bg-blueprint-soft text-blueprint" : "border-line bg-card text-ink/80",
      )}
    >
      {children}
    </span>
  );
}

/** Scroll-triggered fade-up. Motion is dropped automatically under prefers-reduced-motion. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
