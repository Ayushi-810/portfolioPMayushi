"use client";

import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type Pose =
  | "idle"
  | "look"
  | "stake"
  | "crowbar"
  | "broom"
  | "trowel"
  | "level"
  | "blueprint"
  | "shovel"
  | "tape"
  | "clipboard"
  | "hammer"
  | "roller"
  | "keys";

const ink = { stroke: "var(--ink)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const accent = "var(--blueprint)";

/** Arms + prop for each pose. Origin is between the feet; the body faces right. */
const poses: Record<Pose, React.ReactNode> = {
  idle: <path d="M0 -48L-5 -37L-6 -28M0 -48L5 -37L6 -28" {...ink} />,
  look: (
    <>
      {/* one hand shading the eyes, clipboard under the other arm */}
      <path d="M0 -48L-5 -37L-6 -29M0 -48L7 -55L4 -61" {...ink} />
      <path d="M1 -62.5h7" {...ink} />
      <rect x="-12" y="-42" width="8" height="11" rx="1.2" fill="white" stroke="var(--ink)" strokeWidth="1.1" transform="rotate(-8 -8 -36)" />
    </>
  ),
  stake: (
    <>
      {/* mallet raised over a survey stake */}
      <path d="M0 -48L8 -54L12 -60M0 -47L9 -38L15 -36" {...ink} />
      <path d="M12 -60L19 -68" {...ink} />
      <path d="M15 -73l9 5" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      <path d="M22 0V-24" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 -24l5 2.5-5 2.5" fill={accent} stroke="none" />
    </>
  ),
  broom: (
    <>
      {/* sweeping: both hands on a long handle, bristles on the ground */}
      <path d="M0 -48L8 -42L12 -44M0 -46L9 -34L15 -26" {...ink} />
      <path d="M10 -48L26 -4" {...ink} />
      <path d="M21 -5h12l3 5h-18z" fill={accent} stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round" />
    </>
  ),
  trowel: (
    <>
      {/* kneeling-height reach with a trowel */}
      <path d="M0 -48L-5 -37L-6 -28M0 -47L10 -36L16 -30" {...ink} />
      <path d="M16 -30l4 3" {...ink} />
      <path d="M19 -28l9 2-6 6z" fill={accent} stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round" />
    </>
  ),
  level: (
    <>
      {/* holding a spirit level up against the wall */}
      <path d="M0 -48L9 -52L14 -50M0 -47L9 -44L14 -46" {...ink} />
      <rect x="10" y="-53" width="30" height="5" rx="1" fill={accent} stroke="var(--ink)" strokeWidth="1.1" />
      <rect x="22" y="-52.2" width="6" height="3.4" rx="1.5" fill="white" />
    </>
  ),
  crowbar: (
    <>
      <path d="M0 -48L9 -42L15 -44M0 -46L8 -35L14 -32" {...ink} />
      <path d="M13 -50L22 -4l4 -2" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  blueprint: (
    <>
      <path d="M0 -48L-5 -37L-6 -28M0 -48L7 -40L11 -35" {...ink} />
      <path d="M2 -44L19 -33" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  shovel: (
    <>
      <path d="M0 -48L9 -42L16 -45M0 -46L8 -35L15 -28" {...ink} />
      <path d="M17 -50L22 -6" {...ink} />
      <path d="M18 -7h8l-1 9h-6z" fill={accent} stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
    </>
  ),
  tape: (
    <>
      <path d="M0 -48L8 -40L13 -37M0 -47L7 -36L13 -35" {...ink} />
      <rect x="12" y="-41" width="8" height="8" rx="1.5" fill={accent} stroke="var(--ink)" strokeWidth="1.2" />
      <path d="M20 -36H44" stroke={accent} strokeWidth="1.2" strokeDasharray="2 2" />
    </>
  ),
  clipboard: (
    <>
      <path d="M0 -48L7 -42L10 -46M0 -47L9 -38L13 -38" {...ink} />
      <rect x="9" y="-52" width="11" height="15" rx="1.5" fill="white" stroke="var(--ink)" strokeWidth="1.2" />
      <path d="M12 -47h5M12 -44h5M12 -41h3" stroke={accent} strokeWidth="1" />
    </>
  ),
  hammer: (
    <>
      <path d="M0 -48L-5 -37L-6 -28M0 -48L9 -56L13 -62" {...ink} />
      <path d="M13 -62L17 -74" {...ink} />
      <path d="M12 -78l11 4" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  roller: (
    <>
      <path d="M0 -48L8 -55L12 -58M0 -47L9 -47L12 -50" {...ink} />
      <path d="M11 -54L24 -86" {...ink} />
      <rect x="17" y="-94" width="16" height="6" rx="3" fill={accent} stroke="var(--ink)" strokeWidth="1.2" transform="rotate(-22 25 -91)" />
    </>
  ),
  keys: (
    <>
      <path d="M0 -48L-5 -37L-6 -28M0 -48L10 -45L19 -47" {...ink} />
      <circle cx="22" cy="-47" r="3" fill="none" stroke={accent} strokeWidth="1.4" />
      <path d="M22 -44V-37M22 -40h2.5M22 -38h2.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
};

export function Character({
  x,
  pose,
  facing,
  reduced,
  groundY = 410,
  scale = 1.22,
}: {
  x: MotionValue<number>;
  pose: Pose;
  facing: 1 | -1;
  reduced: boolean;
  groundY?: number;
  scale?: number;
}) {
  const [walking, setWalking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(x, "change", () => {
    if (reduced) return;
    setWalking(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWalking(false), 160);
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <motion.g style={{ x }} aria-hidden="true">
      <g transform={`translate(0 ${groundY}) scale(${facing * scale} ${scale})`} className={walking ? "walking" : undefined}>
        {/* legs */}
        <path className="leg leg-l" d="M0 -26L-5 -13L-6 0L-10 0" {...ink} />
        <path className="leg leg-r" d="M0 -26L5 -13L7 0L11 0" {...ink} />
        {/* torso */}
        <path d="M0 -53L0 -26" {...ink} />
        {/* head + hard hat */}
        <circle cx="0" cy="-60" r="6.5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />
        <path d="M-7.5 -62.5a7.5 7.5 0 0 1 15 0z" fill={accent} stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M-10 -62.5H10" {...ink} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={pose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {poses[pose]}
          </motion.g>
        </AnimatePresence>
      </g>
    </motion.g>
  );
}
