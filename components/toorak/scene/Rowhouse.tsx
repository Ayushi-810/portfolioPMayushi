"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { mono } from "./anim";
import { Dust, Fill, Gone, Phase, Reveal, S, Until } from "./build";

/*
 * Scene coordinates (viewBox 0 0 800 600)
 *   house base y=500 · yard 500–528 · sidewalk 528–548 · street below
 *   facade x 170–370, brick y 200–462 · basement/foundation y 462–500 · props live in x 480–780
 *
 * Construction phases (index → what builds; see content `construction.phases`):
 *   0 cleanup · 1 demolition · 2 foundation · 3 structure · 4 roof
 *   5 windows & door · 6 siding · 7 lights · 8 paint/trim/porch · 9 landscape · 10 complete
 */

const RUIN = { stroke: "#8e8b84", strokeWidth: 1.1, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const UP = [190, 254, 318]; // upper windows, 32×66 at y 262
const DOWN = [254, 314]; // lower windows, 36×60 at y 380
const TIMBER = "#c9a06b";
const STEEL = "#7d8796";
const blue = "var(--blueprint)";

/* ───────── Defs ───────── */

export function SceneDefs() {
  return (
    <defs>
      <pattern id="t-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="var(--blueprint)" strokeOpacity="0.06" />
      </pattern>
      <pattern id="t-brick-ruin" width="20" height="8" patternUnits="userSpaceOnUse">
        <rect width="20" height="8" fill="#d3d0c9" />
        <path d="M0 0.5H20M0 4.5H20M0.5 0V4M10.5 4V8" stroke="#e6e4de" />
      </pattern>
      <pattern id="t-brick" width="20" height="8" patternUnits="userSpaceOnUse">
        <rect width="20" height="8" fill="var(--brick)" />
        <rect x="1" y="1" width="8" height="2.5" fill="#d27a52" opacity="0.4" />
        <path d="M0 0.5H20M0 4.5H20M0.5 0V4M10.5 4V8" stroke="#ecd6c6" strokeOpacity="0.6" />
      </pattern>
      <pattern id="t-shingle" width="14" height="8" patternUnits="userSpaceOnUse">
        <rect width="14" height="8" fill="#3e4553" />
        <path d="M0 3.5H14M0 7.5H14M3.5 0V3.5M10.5 4V8" stroke="#59627a" />
      </pattern>
      <pattern id="t-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0V6" stroke="#9f998d" strokeWidth="0.7" />
      </pattern>
      <pattern id="t-mesh" width="6" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 0L6 6M6 0L0 6" stroke="#9aa0aa" strokeWidth="0.5" />
      </pattern>
      <linearGradient id="t-fade-l" x1="0" x2="1">
        <stop offset="0" stopColor="white" stopOpacity="0" />
        <stop offset="0.5" stopColor="white" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="t-fade-r" x1="0" x2="1">
        <stop offset="0.4" stopColor="white" stopOpacity="1" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <mask id="t-mask-l">
        <rect x="0" y="0" width="170" height="600" fill="url(#t-fade-l)" />
      </mask>
      <mask id="t-mask-r">
        <rect x="370" y="0" width="110" height="600" fill="url(#t-fade-r)" />
      </mask>
    </defs>
  );
}

/* ───────── Street, yard, neighbours (always) ───────── */

function Neighbour({ x0, x1, cornice }: { x0: number; x1: number; cornice: number }) {
  const w = x1 - x0;
  const cols = Math.max(1, Math.floor(w / 62));
  const step = w / cols;
  return (
    <g stroke="#c9c6be" strokeWidth="1" fill="none">
      <rect x={x0} y={cornice + 22} width={w} height={500 - cornice - 22} fill="#efede7" />
      <path d={`M${x0 - 4} ${cornice}H${x1 + 4}V${cornice + 22}H${x0 - 4}Z`} fill="#e8e6e0" />
      {Array.from({ length: cols }, (_, i) => (
        <g key={i}>
          <rect x={x0 + i * step + step / 2 - 15} y={cornice + 70} width="30" height="60" />
          <rect x={x0 + i * step + step / 2 - 15} y={cornice + 186} width="30" height="56" />
        </g>
      ))}
      <path d={`M${x0} 462H${x1}`} />
    </g>
  );
}

export function Context() {
  return (
    <g aria-hidden="true">
      <rect width="800" height="600" fill="url(#t-grid)" />
      <g mask="url(#t-mask-l)">
        <Neighbour x0={30} x1={168} cornice={186} />
      </g>
      <g mask="url(#t-mask-r)">
        <Neighbour x0={372} x1={500} cornice={170} />
      </g>
      <rect x="0" y="500" width="800" height="28" fill="#ebe8df" />
      <rect x="0" y="528" width="800" height="20" fill="#efeee9" />
      <path d={Array.from({ length: 21 }, (_, i) => `M${i * 40} 528v20`).join("")} stroke="#dcdad3" />
      <rect x="0" y="548" width="800" height="52" fill="#e7e6e1" />
      <path d="M0 500H800M0 528H800M0 548H800" stroke="var(--ink)" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M0 576H800" stroke="#d6d4cd" strokeWidth="2" strokeDasharray="22 18" />
    </g>
  );
}

/* ───────── The original broken house ───────── */

const weeds = Array.from({ length: 44 }, (_, i) => {
  const x = 160 + i * 5.2;
  const h = 10 + Math.abs(Math.sin(i * 12.9898) * 22);
  const lean = Math.sin(i * 3.7) * 5;
  return `M${x.toFixed(1)} 528q${(lean / 2).toFixed(1)} ${(-h / 2).toFixed(1)} ${lean.toFixed(1)} ${(-h).toFixed(1)}`;
}).join("");

function RuinFacade() {
  return (
    <g aria-hidden="true">
      <rect x="170" y="200" width="200" height="262" fill="url(#t-brick-ruin)" {...RUIN} />
      <path d="M300 214c4 20-3 40 2 60" stroke="#bcb8af" strokeWidth="6" strokeOpacity="0.35" fill="none" />
      <rect x="166" y="462" width="208" height="38" fill="#c7c3ba" {...RUIN} />
      {/* empty openings (visible once the boards come off) */}
      {UP.map((x) => (
        <rect key={x} x={x} y="262" width="32" height="66" fill="#5f5c57" {...RUIN} />
      ))}
      {DOWN.map((x) => (
        <rect key={x} x={x} y="380" width="36" height="60" fill="#5f5c57" {...RUIN} />
      ))}
      <rect x="188" y="360" width="36" height="10" fill="#5f5c57" {...RUIN} />
      <rect x="188" y="372" width="36" height="90" fill="#5f5c57" {...RUIN} />
    </g>
  );
}

function RuinCracks() {
  return (
    <path
      d="M232 214l6 18-4 9 7 15M352 300l-8 12 3 10-7 14M200 420l9 7-3 11M262 462l-4 14 6 8-3 16M330 470l10 12"
      fill="none"
      {...RUIN}
    />
  );
}

function RuinBoards() {
  return (
    <g aria-hidden="true">
      {UP.map((x) => (
        <g key={x}>
          <rect x={x - 2} y="268" width="36" height="54" fill="#bdb6a6" {...RUIN} />
          <path d={`M${x + 3} 274h2M${x + 27} 274h2M${x + 3} 316h2M${x + 27} 316h2`} stroke="#8e8b84" strokeWidth="1.6" />
        </g>
      ))}
      {DOWN.map((x) => (
        <path key={x} d={`M${x - 3} 390L${x + 39} 430M${x - 3} 428L${x + 39} 392`} stroke="#c4bdae" strokeWidth="8" />
      ))}
      <rect x="188" y="372" width="36" height="90" fill="#bdb6a6" {...RUIN} />
      <path d="M192 380h28M192 452h28" stroke="#8e8b84" strokeWidth="0.8" />
    </g>
  );
}

function RuinCornice() {
  return (
    <g aria-hidden="true">
      <path d="M164 176L376 186L376 206L330 214L304 204L164 200Z" fill="#b8b4ab" {...RUIN} />
      <path d="M170 200v20h6v-20M266 202v18h6v-17" fill="#b8b4ab" {...RUIN} />
      <path d="M358 210l8 26-6 2-6-24" fill="#b8b4ab" {...RUIN} />
    </g>
  );
}

function RuinStoop() {
  return (
    <g aria-hidden="true">
      <path d="M184 462h44v9h-44zM180 471h52v10h-52zM176 481h60v9h-60zM172 490h68v10h-68z" fill="#c9c5bc" {...RUIN} />
      <path d="M222 481l8-6 6 6" fill="#ebe8df" stroke="none" />
      <path d="M174 500V456H182M238 500V462l-8-8" fill="none" {...RUIN} />
    </g>
  );
}

function RuinYard() {
  return (
    <g aria-hidden="true">
      <path d="M252 528L260 512L272 516L280 506L292 514L300 509L312 520L318 528Z" fill="#b9b5ad" {...RUIN} />
      <path d="M268 522h9v5h-9zM288 518l8 2-1 5-8-2z" fill="#a9a49b" {...RUIN} />
      <path d="M326 528c-2-10 4-16 11-16s12 6 10 16z" fill="#7f7c76" {...RUIN} />
      <circle cx="244" cy="522" r="6" fill="none" {...RUIN} strokeWidth="2.4" />
      <path d={weeds} fill="none" stroke="#8e8b84" strokeWidth="1" strokeLinecap="round" />
      <path d="M362 528V488" stroke="#6d6a64" strokeWidth="2" />
      <rect x="338" y="468" width="48" height="22" rx="2" fill="#f2f0ea" stroke="#6d6a64" />
      <text x="362" y="482.5" textAnchor="middle" fontSize="8" fontWeight="600" fill="#4b4a46" style={mono}>
        FOR SALE
      </text>
    </g>
  );
}

/* ───────── Construction phases ───────── */

function SiteFence() {
  const panel = (x0: number, x1: number) => (
    <g key={x0}>
      <S as="rect" x={x0} y="504" width={x1 - x0} height="24" fill="url(#t-mesh)" stroke={STEEL} sw={1} />
      <S
        d={Array.from({ length: Math.floor((x1 - x0) / 34) + 1 }, (_, i) => `M${x0 + i * 34} 500V528`).join("")}
        stroke={STEEL}
        sw={1.8}
      />
    </g>
  );
  return (
    <>
      {panel(14, 150)}
      {panel(384, 470)}
      {/* project sign */}
      <S d="M36 528V462M92 528V462" stroke="#6b5440" sw={2} />
      <S as="rect" x="22" y="428" width="84" height="36" rx="2" fill="white" />
      <Fill>
        <text x="64" y="443" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--ink)" style={mono}>
          RENOVATION
        </text>
        <text x="64" y="456" textAnchor="middle" fontSize="6.5" fill={blue} style={mono}>
          IN PROGRESS
        </text>
      </Fill>
    </>
  );
}

function Measurements() {
  return (
    <>
      <S d="M170 160H370M170 154v12M370 154v12" stroke={blue} sw={0.9} />
      <S d="M150 200V462M144 200h12M144 462h12" stroke={blue} sw={0.9} />
      <Fill>
        <path d="M170 200V164M370 200V164" stroke={blue} strokeWidth="0.6" strokeDasharray="2 3" />
        <rect x="248" y="153" width="44" height="14" rx="2" fill="var(--scene)" />
        <text x="270" y="163" textAnchor="middle" fontSize="7.5" fill={blue} style={mono}>
          WIDTH
        </text>
      </Fill>
    </>
  );
}

function FoundationSlab({ p }: { p: MotionValue<number> }) {
  return (
    <>
      <Reveal p={p} x={162} y={462} w={216} h={38} dir="right" id="t-pour">
        <rect x="162" y="462" width="216" height="38" fill="#cbc6bc" />
        <rect x="162" y="462" width="216" height="38" fill="url(#t-hatch)" opacity="0.55" />
      </Reveal>
      <S as="rect" x="162" y="462" width="216" height="38" />
    </>
  );
}

function Scaffold() {
  const levels = [440, 352, 262];
  return (
    <>
      <S d="M346 528V196M398 528V196" stroke={STEEL} sw={2} />
      {levels.map((y) => (
        <S key={y} d={`M340 ${y}H404`} stroke={STEEL} sw={1.4} />
      ))}
      <S d="M346 528L398 440M398 440L346 352M346 352L398 262" stroke={STEEL} sw={0.9} />
      {levels.map((y) => (
        <S key={`p${y}`} as="rect" x="338" y={y - 5} width="68" height="4" fill={TIMBER} sw={0.8} />
      ))}
    </>
  );
}

function Framing() {
  return (
    <>
      <S d="M170 201H370" stroke={TIMBER} sw={3} />
      <S d="M170 348H370" stroke={TIMBER} sw={2.4} />
      <S d="M172 200V462M368 200V462" stroke={TIMBER} sw={3} />
      <S d={[...UP.map((x) => `M${x - 3} 258h38`), ...DOWN.map((x) => `M${x - 3} 376h42`), "M185 356h42"].join("")} stroke={TIMBER} sw={2.4} />
    </>
  );
}

function InspectionTags() {
  const tag = (x: number, y: number, r: number) => (
    <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
      <S d="M0 -8V0" stroke="var(--ink)" sw={0.8} />
      <S as="rect" x="-17" y="0" width="34" height="14" rx="2" fill="white" stroke={blue} sw={0.9} />
      <Fill>
        <circle cx="0" cy="-8" r="1.6" fill="var(--ink)" />
        <text x="0" y="9.8" textAnchor="middle" fontSize="6.5" fontWeight="600" fill={blue} style={mono}>
          PASS ✓
        </text>
      </Fill>
    </g>
  );
  return (
    <>
      {tag(222, 232, -4)}
      {tag(300, 446, 3)}
    </>
  );
}

function Roof() {
  return (
    <>
      <S d="M164 200L270 170L376 200M200 200L216 190M236 200L248 181M270 200V170M304 200L292 181M340 200L324 190" stroke={TIMBER} sw={1.6} />
      <S as="rect" x="326" y="150" width="20" height="40" fill="url(#t-brick)" />
      <S as="rect" x="322" y="145" width="28" height="6" fill="#3e4553" />
      <S as="polygon" points="164,200 270,170 376,200" fill="url(#t-shingle)" />
      <S as="rect" x="160" y="194" width="220" height="16" fill="#4a4f5c" />
      <S d="M172 210v12h7v-12M266 210v12h7v-12M361 210v12h7v-12" fill="#4a4f5c" sw={0.9} />
    </>
  );
}

function Openings() {
  return (
    <>
      {UP.map((x) => (
        <g key={x}>
          <S as="rect" x={x} y="262" width="32" height="66" fill="#56616d" />
          <Fill>
            <path d={`M${x + 1} 295H${x + 31}M${x + 16} 263V327`} stroke="#e9e6df" strokeWidth="2" />
          </Fill>
        </g>
      ))}
      {DOWN.map((x) => (
        <g key={x}>
          <S as="rect" x={x} y="380" width="36" height="60" fill="#56616d" />
          <Fill>
            <path d={`M${x + 1} 410H${x + 35}M${x + 18} 381V439`} stroke="#e9e6df" strokeWidth="2" />
          </Fill>
        </g>
      ))}
      <S as="rect" x="188" y="360" width="36" height="10" fill="#56616d" />
      <S as="rect" x="188" y="372" width="36" height="90" fill="#8a5a3b" />
      <Fill>
        <rect x="194" y="380" width="24" height="30" rx="1" fill="none" stroke="#6e4630" />
        <rect x="194" y="418" width="24" height="36" rx="1" fill="none" stroke="#6e4630" />
        <circle cx="219" cy="418" r="1.8" fill="#e8d6a8" />
      </Fill>
    </>
  );
}

function Siding({ p }: { p: MotionValue<number> }) {
  const d = [
    "M170 200H370V462H170Z",
    ...UP.map((x) => `M${x} 262V328H${x + 32}V262Z`),
    ...DOWN.map((x) => `M${x} 380V440H${x + 36}V380Z`),
    "M188 360V462H224V360Z",
  ].join("");
  return (
    <>
      <Reveal p={p} x={170} y={200} w={200} h={262} dir="up" id="t-siding">
        <path d={d} fillRule="evenodd" fill="url(#t-brick)" />
      </Reveal>
      <S d={d} fillRule="evenodd" />
    </>
  );
}

function Lights() {
  const glow = "var(--glass)";
  return (
    <Fill>
      {UP.map((x) => (
        <rect key={x} x={x - 3} y="259" width="38" height="72" rx="3" fill={glow} opacity="0.28" />
      ))}
      {DOWN.map((x) => (
        <rect key={x} x={x - 3} y="377" width="42" height="66" rx="3" fill={glow} opacity="0.28" />
      ))}
      {UP.map((x) => (
        <rect key={`g${x}`} x={x + 1} y="263" width="30" height="64" fill={glow} />
      ))}
      {DOWN.map((x) => (
        <rect key={`g${x}`} x={x + 1} y="381" width="34" height="58" fill={glow} />
      ))}
      <rect x="189" y="361" width="34" height="8" fill={glow} />
      {/* someone lives here now: a pendant lamp, a plant, a kitchen glow */}
      <path d="M270 263v9M263 279h14l-3-7h-8z" stroke="var(--ink)" strokeWidth="0.8" fill="var(--ink)" fillOpacity="0.5" />
      <path d="M262 439v-6h9v6M266 433c-5-7-2-12 0-14M266 433c4-5 8-7 9-12" stroke="#4f7446" strokeWidth="1.1" fill="none" />
      <rect x="318" y="420" width="28" height="19" fill="#f2c46d" opacity="0.7" />
      {UP.map((x) => (
        <path key={`m${x}`} d={`M${x + 1} 295H${x + 31}M${x + 16} 263V327`} stroke="#fbf6ea" strokeWidth="2" />
      ))}
      {DOWN.map((x) => (
        <path key={`m${x}`} d={`M${x + 1} 410H${x + 35}M${x + 18} 381V439`} stroke="#fbf6ea" strokeWidth="2" />
      ))}
    </Fill>
  );
}

function PaintTrim() {
  const trim = "var(--trim, #f5efe3)";
  return (
    <>
      {UP.map((x) => (
        <g key={x}>
          <S as="rect" x={x - 3} y="255" width="38" height="6" fill={trim} sw={0.8} />
          <S as="rect" x={x - 4} y="328" width="40" height="4" fill={trim} sw={0.8} />
        </g>
      ))}
      {DOWN.map((x) => (
        <g key={x}>
          <S as="rect" x={x - 3} y="373" width="42" height="6" fill={trim} sw={0.8} />
          <S as="rect" x={x - 4} y="440" width="44" height="4" fill={trim} sw={0.8} />
        </g>
      ))}
      <S as="rect" x="188" y="372" width="36" height="90" fill="var(--door)" />
      <Fill>
        <rect x="194" y="380" width="24" height="30" rx="1" fill="none" stroke="#f5efe3" strokeOpacity="0.55" />
        <rect x="194" y="418" width="24" height="36" rx="1" fill="none" stroke="#f5efe3" strokeOpacity="0.55" />
        <circle cx="219" cy="418" r="1.9" fill="#e8d6a8" />
      </Fill>
      <S d="M184 372V356H228V372" stroke={trim} sw={3} />
    </>
  );
}

function PaintCornice() {
  return (
    <>
      <S as="rect" x="160" y="194" width="220" height="16" fill="#efe7d6" />
      <S d="M172 210v12h7v-12M266 210v12h7v-12M361 210v12h7v-12" fill="#efe7d6" sw={0.9} />
      <Fill>
        <path d={Array.from({ length: 27 }, (_, i) => `M${166 + i * 8} 206v4`).join("")} stroke="#b9ad97" />
      </Fill>
    </>
  );
}

function Porch() {
  return (
    <>
      <S d="M184 462h44v9h-44zM180 471h52v10h-52zM176 481h60v9h-60zM172 490h68v10h-68z" fill="#e4dfd3" />
      <S d="M174 500V454M238 500V454M174 456H186M238 456H226" sw={1.6} />
      <S d="M174 478H184M238 478H228" sw={0.9} />
      <Fill>
        <rect x="231" y="378" width="7" height="10" rx="1.5" fill="var(--glass)" stroke="var(--ink)" strokeWidth="0.8" />
      </Fill>
    </>
  );
}

function Landscape() {
  return (
    <>
      <Fill>
        <rect x="140" y="501" width="260" height="26" fill="#a9c294" opacity="0.65" />
      </Fill>
      <S as="rect" x="186" y="500" width="40" height="28" fill="#e9e3d6" sw={0.9} />
      <Fill>
        <path d="M186 509h40M186 518h40M206 500v9M196 509v9M216 509v9M206 518v10" stroke="#cfc7b6" strokeWidth="0.8" />
      </Fill>
      <S as="ellipse" cx="262" cy="512" rx="18" ry="12" fill="#6f9461" />
      <S as="ellipse" cx="300" cy="510" rx="20" ry="14" fill="#6f9461" />
      <S as="ellipse" cx="282" cy="516" rx="11" ry="8" fill="#4f7446" />
      <S as="ellipse" cx="340" cy="513" rx="16" ry="11" fill="#4f7446" />
      <S d="M128 528V446" stroke="#6b5440" sw={4} />
      <S as="circle" cx="128" cy="420" r="30" fill="#6f9461" />
      <S as="circle" cx="110" cy="436" r="18" fill="#4f7446" />
    </>
  );
}

function Complete() {
  return (
    <>
      <Fill>
        <circle cx="96" cy="96" r="26" fill="var(--glass)" opacity="0.85" />
      </Fill>
      <S d="M362 528V486" stroke="#6b5440" sw={2} />
      <S as="rect" x="336" y="464" width="52" height="24" rx="2" fill="white" />
      <Fill>
        <text x="362" y="480.5" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="1.5" fill="var(--brick)" style={mono}>
          SOLD
        </text>
      </Fill>
    </>
  );
}

/* ───────── The house ───────── */

/** Gray → warm as the build progresses (0–1). */
function WarmFilter({ warmth }: { warmth: MotionValue<number> }) {
  const ref = useRef<SVGFEColorMatrixElement>(null);
  const sat = (v: number) => String(0.3 + 0.7 * v);
  useMotionValueEvent(warmth, "change", (v) => ref.current?.setAttribute("values", sat(v)));
  return (
    <defs>
      <filter id="t-warm" colorInterpolationFilters="sRGB">
        <feColorMatrix ref={ref} type="saturate" values={sat(warmth.get())} />
      </filter>
    </defs>
  );
}

export function Rowhouse({ phases, warmth }: { phases: MotionValue<number>[]; warmth: MotionValue<number> }) {
  const [cleanup, demolition, foundation, structure, roof, openings, siding, lights, paint, landscape, complete] = phases;
  // the old facade leans slightly until the structure phase straightens it
  const skewX = useTransform(structure, [0, 1], [-1.4, 0]);

  return (
    <>
      <WarmFilter warmth={warmth} />
      <g filter="url(#t-warm)">
        <motion.g style={{ skewX, originX: "50%", originY: "100%" }}>
          <RuinFacade />
          <Gone p={foundation}>
            <RuinCracks />
          </Gone>
          <Gone p={demolition} drop={18}>
            <RuinBoards />
          </Gone>
        </motion.g>

        <Phase p={structure}>
          <Framing />
        </Phase>
        <Phase p={siding}>
          <Siding p={siding} />
        </Phase>
        <Phase p={foundation}>
          <FoundationSlab p={foundation} />
        </Phase>
        <Phase p={openings}>
          <Openings />
        </Phase>
        <Phase p={lights}>
          <Lights />
        </Phase>
        <Phase p={paint}>
          <PaintTrim />
        </Phase>

        <Gone p={demolition} drop={40}>
          <RuinCornice />
        </Gone>
        <Phase p={roof}>
          <Roof />
        </Phase>
        <Phase p={paint}>
          <PaintCornice />
        </Phase>

        <Gone p={paint}>
          <RuinStoop />
        </Gone>
        <Phase p={paint}>
          <Porch />
        </Phase>

        <Until until={paint} drop={16}>
          <Phase p={foundation}>
            <Scaffold />
          </Phase>
        </Until>
        <Until until={complete}>
          <Phase p={structure}>
            <InspectionTags />
          </Phase>
          <Phase p={demolition}>
            <Measurements />
          </Phase>
        </Until>

        <Gone p={cleanup} drop={6}>
          <RuinYard />
        </Gone>
        <Until until={complete}>
          <Phase p={cleanup}>
            <SiteFence />
          </Phase>
        </Until>
        <Phase p={landscape}>
          <Landscape />
        </Phase>
        <Phase p={complete}>
          <Complete />
        </Phase>
      </g>

      {/* dust as each phase completes */}
      <Dust p={cleanup} x={290} y={515} />
      <Dust p={demolition} x={270} y={300} />
      <Dust p={foundation} x={270} y={494} />
      <Dust p={structure} x={270} y={340} />
      <Dust p={roof} x={270} y={186} />
      <Dust p={openings} x={270} y={330} />
      <Dust p={siding} x={300} y={420} />
      <Dust p={paint} x={210} y={492} />
      <Dust p={landscape} x={210} y={516} />
      <Dust p={complete} x={362} y={500} />
    </>
  );
}
