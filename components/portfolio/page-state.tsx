"use client";

import { MotionConfig, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { INTRO_KEY } from "./keys";

type PageState = {
  /** "pending" until we know whether the opening plays; "done" once it has finished or been skipped. */
  intro: "pending" | "playing" | "done";
  finishIntro: () => void;
};

const Ctx = createContext<PageState | null>(null);

export function usePage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePage must be used inside <PageProvider>");
  return ctx;
}

export function PageProvider({ children }: { children: ReactNode }) {
  const [intro, setIntro] = useState<PageState["intro"]>("pending");

  // The opening plays once per session, and never under reduced motion.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(INTRO_KEY) === "1";
      } catch {}
      seen ||= window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIntro(seen ? "done" : "playing");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    document.documentElement.dataset.introSeen = "1";
    setIntro("done");
  }, []);

  return (
    <Ctx.Provider value={{ intro, finishIntro }}>
      <MotionConfig reducedMotion="user">
        <div className="theme min-h-svh bg-paper text-ink">{children}</div>
      </MotionConfig>
    </Ctx.Provider>
  );
}

/** Subtle fade/slide on scroll. */
export function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
