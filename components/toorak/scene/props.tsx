"use client";

import { motion } from "framer-motion";
import { deal } from "@/content/toorak";
import { DrawPath, FadeIn, mono, useReduced, useTr } from "./anim";

const blue = "var(--blueprint)";
const ink = "var(--ink)";
const muted = "var(--muted)";

/* ───────── Stage 0: the listing ───────── */

export function ListingProp() {
  const rows = [
    { label: "Purchase", value: deal.purchase, color: ink },
    { label: "Renovation", value: deal.rehab, color: ink },
    { label: "After repair", value: deal.arv, color: blue },
  ];
  return (
    <g>
      <DrawPath d="M392 300C430 300 452 250 500 250" stroke={muted} strokeWidth="0.9" strokeDasharray="3 3" delay={1.6} duration={1} />
      <FadeIn delay={1.2} y={12}>
        <rect x="500" y="150" width="250" height="220" rx="10" fill="white" stroke="#e4e2db" />
        <text x="522" y="180" fontSize="9" letterSpacing="1.4" fill={muted} style={mono}>
          PROPERTY
        </text>
        <text x="522" y="206" fontSize="19" fill={ink} fontFamily="var(--font-instrument-serif), serif" fontStyle="italic">
          1920s rowhouse
        </text>
        <text x="522" y="225" fontSize="11" fill={muted}>
          Newark, NJ · 2 stories · needs a full rehab
        </text>
        <path d="M522 242H728" stroke="#e4e2db" />
      </FadeIn>
      {rows.map((r, i) => (
        <FadeIn key={r.label} delay={1.8 + i * 0.35} x={-6}>
          <text x="522" y={272 + i * 30} fontSize="10" letterSpacing="0.8" fill={muted} style={mono}>
            {r.label.toUpperCase()}
          </text>
          <text x="728" y={272 + i * 30} textAnchor="end" fontSize="14" fontWeight="500" fill={r.color} style={mono}>
            {r.value}
          </text>
        </FadeIn>
      ))}
    </g>
  );
}

/* ───────── Stage 1: three doors into Toorak ───────── */

const NODE = { x: 712, y: 206 };
const channels = [
  { id: "corr", label: "CORRESPONDENT", y: 96, d: `M538 96C620 96 630 ${NODE.y - 8} ${NODE.x - 42} ${NODE.y - 8}`, active: false },
  { id: "table", label: "TABLE FUNDING", y: 206, d: `M538 206H${NODE.x - 42}`, active: true },
  { id: "direct", label: "DIRECT", y: 316, d: `M538 316C620 316 630 ${NODE.y + 8} ${NODE.x - 42} ${NODE.y + 8}`, active: false },
];

function ChannelIcon({ id }: { id: string }) {
  const s = { fill: "none", stroke: ink, strokeWidth: 1.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  if (id === "corr")
    return (
      <g {...s}>
        {/* local lender's office */}
        <path d="M-10 9V-3L0 -10L10 -3V9ZM-5 9V2h4v7M3 1h4v4H3z" />
      </g>
    );
  if (id === "table")
    return (
      <g {...s}>
        {/* closing table with papers */}
        <path d="M-11 -1H11M-8 -1V9M8 -1V9M-6 -5h7l1 4M2 -6h6v5" />
      </g>
    );
  return (
    <g {...s}>
      {/* phone / portal */}
      <rect x="-6" y="-10" width="12" height="20" rx="2.5" />
      <path d="M-2 6h4M-3 -5h6M-3 -2h4" />
    </g>
  );
}

function FlowDot({ d, delay }: { d: string; delay: number }) {
  const reduced = useReduced();
  if (reduced) return null;
  return (
    <motion.circle
      r="3.2"
      fill={blue}
      style={{ offsetPath: `path("${d}")`, offsetRotate: "0deg" }}
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
    />
  );
}

export function ChannelsProp() {
  const tr = useTr();
  const form = [
    { label: "Borrower", value: "Maria, via her LLC" },
    { label: "Property", value: "Rowhouse · Newark, NJ" },
    { label: "Product", value: "Bridge · 12 months" },
    { label: "Request", value: deal.totalLoan },
  ];
  return (
    <g>
      {channels.map((c, i) => (
        <g key={c.id}>
          <DrawPath
            d={c.d}
            stroke={c.active ? blue : "#b8bcc6"}
            strokeWidth={c.active ? 2 : 1.2}
            strokeDasharray={c.active ? undefined : "4 4"}
            delay={0.8 + i * 0.4}
            duration={1.2}
          />
          <FadeIn delay={0.3 + i * 0.3} scale={0.85}>
            <circle cx="516" cy={c.y} r="22" fill="white" stroke={c.active ? blue : "#d5d3cc"} strokeWidth={c.active ? 1.6 : 1} />
            <g transform={`translate(516 ${c.y})`}>
              <ChannelIcon id={c.id} />
            </g>
            <text x="516" y={c.y + 38} textAnchor="middle" fontSize="8" letterSpacing="1" fill={c.active ? blue : muted} style={mono}>
              {c.label}
            </text>
          </FadeIn>
          <FlowDot d={c.d} delay={2.2 + i * 0.5} />
        </g>
      ))}
      <FadeIn delay={1.9} scale={0.9}>
        <rect x={NODE.x - 42} y={NODE.y - 20} width="84" height="40" rx="8" fill={ink} />
        <text x={NODE.x} y={NODE.y + 4} textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--paper)" fontWeight="600" style={mono}>
          TOORAK
        </text>
      </FadeIn>

      {/* the application fills itself in */}
      <FadeIn delay={2.3} y={10}>
        <rect x="500" y="372" width="250" height="118" rx="9" fill="white" stroke="#e4e2db" />
        <text x="518" y="394" fontSize="8.5" letterSpacing="1.4" fill={muted} style={mono}>
          LOAN APPLICATION
        </text>
      </FadeIn>
      {form.map((f, i) => {
        const y = 416 + i * 20;
        return (
          <g key={f.label}>
            <FadeIn delay={2.6 + i * 0.1}>
              <text x="518" y={y} fontSize="9" fill={muted}>
                {f.label}
              </text>
              <path d={`M590 ${y + 3}H732`} stroke="#ecebe6" />
            </FadeIn>
            <motion.text
              x="590"
              y={y}
              fontSize="10"
              fill={ink}
              style={mono}
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              transition={tr({ duration: 0.9, delay: 3 + i * 0.6, ease: "linear" })}
            >
              {f.value}
            </motion.text>
          </g>
        );
      })}
    </g>
  );
}
