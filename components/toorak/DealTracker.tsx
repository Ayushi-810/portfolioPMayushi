import { page, type Stage, type Tone } from "@/content/toorak";
import { cx } from "@/components/ui";

const toneClass: Record<Tone, string> = {
  pass: "text-pass",
  warn: "text-warn-ink",
  fail: "text-fail",
  info: "text-blueprint",
  neutral: "text-ink",
};

const dotClass: Record<Tone, string> = {
  pass: "bg-pass",
  warn: "bg-warn",
  fail: "bg-fail",
  info: "bg-blueprint",
  neutral: "bg-ink/30",
};

/** Values always sit side by side: 2 or 3 across, 4 as a 2 × 2 grid on phones. */
const colsClass = (n: number) =>
  n === 4 ? "grid-cols-2 sm:grid-cols-4" : n === 3 ? "grid-cols-3" : n === 2 ? "grid-cols-2" : "grid-cols-1";

export function DealTracker({ rows }: { rows: Stage["dealTracker"] }) {
  return (
    <section aria-label={page.dealTrackerLabel} className="rounded-xl border border-line bg-card shadow-[0_1px_2px_rgba(14,17,22,0.04),0_10px_28px_-18px_rgba(14,17,22,0.14)]">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <h3 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{page.dealTrackerLabel}</h3>
      </header>
      <dl className={cx("grid gap-px overflow-hidden rounded-b-xl bg-line", colsClass(rows.length))}>
        {rows.map((r) => {
          const tone = r.tone ?? "neutral";
          return (
            <div key={r.label} className="min-w-0 bg-card px-3 py-3 sm:px-4">
              <dt className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted sm:text-[10px] sm:tracking-[0.1em]">
                <span aria-hidden="true" className={cx("size-1.5 rounded-full", dotClass[tone])} />
                {r.label}
              </dt>
              <dd className={cx("mt-1 hyphens-auto break-words font-mono text-[13.5px] font-medium leading-snug tabular-nums sm:mt-1.5 sm:text-lg", toneClass[tone])}>{r.value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
