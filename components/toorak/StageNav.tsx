"use client";

import { stages } from "@/content/toorak";
import { cx } from "@/components/ui";

/** Slides: 0 = intro, 1–9 = stages 00–08. */
export const SLIDE_COUNT = stages.length + 1;

export function slideLabel(slide: number) {
  if (slide === 0) return "Intro: Toorak in 30 seconds";
  const s = stages[slide - 1];
  return `Stage ${slide - 1} of ${stages.length - 1}: ${s.short}`;
}

function Arrow({ dir }: { dir: "l" | "r" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
      <path d={dir === "l" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StageNav({ slide, go }: { slide: number; go: (n: number) => void }) {
  const stageNo = slide - 1;
  const counter =
    slide === 0 ? "Intro" : `${String(stageNo).padStart(2, "0")} / ${String(stages.length - 1).padStart(2, "0")}`;

  const btn =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors hover:border-ink/30 disabled:opacity-35 disabled:hover:border-line";

  return (
    <nav aria-label="Stages" className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
      <button type="button" className={btn} onClick={() => go(slide - 1)} disabled={slide === 0} aria-label="Previous stage">
        <Arrow dir="l" />
      </button>

      <ol className="flex min-w-0 flex-1 items-start gap-1">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => {
          const isEnd = i === 0;
          const label = isEnd ? "Intro" : stages[i - 1].short;
          const done = i < slide;
          const current = i === slide;
          return (
            <li key={i} className={cx("min-w-0", isEnd ? "flex-none" : "flex-1")}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={current ? "step" : undefined}
                aria-label={slideLabel(i)}
                className="group flex w-full flex-col gap-1.5 rounded-md py-1.5 text-left"
              >
                <span
                  className={cx(
                    "block h-1.5 rounded-full transition-colors duration-500",
                    isEnd ? "w-3" : "w-full",
                    current ? "bg-blueprint" : done ? "bg-blueprint/45" : "bg-line group-hover:bg-ink/20",
                  )}
                />
                <span
                  className={cx(
                    "hidden truncate font-mono text-[9.5px] uppercase tracking-[0.06em] xl:block",
                    current ? "text-ink" : "text-muted",
                    isEnd && "sr-only",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="w-14 shrink-0 text-center font-mono text-[12px] tabular-nums text-ink">{counter}</p>

      <button type="button" className={btn} onClick={() => go(slide + 1)} disabled={slide === SLIDE_COUNT - 1} aria-label="Next stage">
        <Arrow dir="r" />
      </button>
    </nav>
  );
}
