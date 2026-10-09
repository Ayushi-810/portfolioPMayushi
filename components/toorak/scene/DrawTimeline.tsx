"use client";

import { motion } from "framer-motion";
import { drawTimeline as copy } from "@/content/toorak";
import type { DrawStep } from "../useConstruction";
import { mono, useReduced } from "./anim";

const blue = "var(--blueprint)";
const pass = "var(--pass)";
const line = "#e4e2db";
const muted = "var(--muted)";

/**
 * Stage 6: four draw cycles. Each row's state comes from the construction engine, so the
 * "$20,000 wired" moment and the matching build phase start together.
 */
export function DrawTimeline({ draws }: { draws: DrawStep[] }) {
  const reduced = useReduced();
  const wired = draws.filter((d) => d === 4).length;
  const released = wired * copy.perDraw;
  const T = reduced ? { duration: 0 } : { duration: 0.45 };

  return (
    <g>
      <text x="492" y="88" fontSize="9" letterSpacing="1.4" fill={muted} style={mono}>
        {copy.label.toUpperCase()}
      </text>
      {draws.map((step, k) => {
        const y = 102 + k * 72;
        const active = step > 0 && step < 4;
        const done = step === 4;
        return (
          <g key={k}>
            <motion.rect
              x="492"
              y={y}
              width="280"
              height="60"
              rx="8"
              fill="white"
              initial={false}
              animate={{ stroke: active ? "#2f5bea" : done ? "#b9dcc9" : line }}
              transition={T}
              strokeWidth="1"
            />
            <text x="506" y={y + 22} fontSize="9" letterSpacing="1" fill={muted} style={mono}>
              DRAW {k + 1}
            </text>
            <text x="506" y={y + 44} fontSize="13" fontWeight="500" fill={done ? pass : "var(--ink)"} style={mono}>
              {copy.amount}
            </text>

            {copy.steps.map((label, s) => {
              const cx = 604 + s * 44;
              const reached = step >= s + 1;
              const isWired = s === 3;
              return (
                <g key={label}>
                  {s > 0 && (
                    <motion.path
                      d={`M${cx - 33} ${y + 22}H${cx - 11}`}
                      stroke={blue}
                      strokeWidth="1.2"
                      initial={false}
                      animate={{ pathLength: reached ? 1 : 0, opacity: reached ? 1 : 0.15 }}
                      transition={T}
                    />
                  )}
                  <motion.circle
                    cx={cx}
                    cy={y + 22}
                    r="9"
                    initial={false}
                    animate={{
                      fill: reached ? (isWired ? "#2e7d5b" : "#2f5bea") : "#ffffff",
                      stroke: reached ? (isWired ? "#2e7d5b" : "#2f5bea") : "#d5d3cc",
                    }}
                    transition={T}
                    strokeWidth="1.2"
                  />
                  {/* inspection: % complete ring + camera flash */}
                  {s === 1 && (
                    <>
                      <motion.circle
                        cx={cx}
                        cy={y + 22}
                        r="12.5"
                        fill="none"
                        stroke={blue}
                        strokeWidth="1.6"
                        transform={`rotate(-90 ${cx} ${y + 22})`}
                        initial={false}
                        animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
                      />
                      {step === 2 && !reduced && (
                        <motion.circle
                          cx={cx}
                          cy={y + 22}
                          r="9"
                          fill="white"
                          initial={{ opacity: 0.9, scale: 0.6 }}
                          animate={{ opacity: 0, scale: 2 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </>
                  )}
                  <text
                    x={cx}
                    y={y + 25.5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill={reached ? "white" : "#b5b8c0"}
                    style={mono}
                  >
                    {s === 0 ? "↗" : s === 1 ? "◉" : s === 2 ? "✓" : "$"}
                  </text>
                  <text x={cx} y={y + 47} textAnchor="middle" fontSize="7" fill={reached ? "var(--ink)" : muted} style={mono}>
                    {label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* budget released */}
      <text x="492" y="410" fontSize="9" letterSpacing="1.2" fill={muted} style={mono}>
        {copy.released.toUpperCase()}
      </text>
      <text x="772" y="410" textAnchor="end" fontSize="11" fill="var(--ink)" style={mono}>
        ${released.toLocaleString("en-US")} {copy.of}
      </text>
      <rect x="492" y="418" width="280" height="6" rx="3" fill="#e9e7e1" />
      <motion.rect
        x="492"
        y="418"
        height="6"
        rx="3"
        fill={pass}
        initial={false}
        animate={{ width: (280 * wired) / draws.length }}
        transition={reduced ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      />
    </g>
  );
}
