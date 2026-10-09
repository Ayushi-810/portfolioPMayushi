"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { products } from "@/content/toorak";
import { cx } from "@/components/ui";

/** Bridge / DSCR tabs. Arrow keys move between tabs (and don't change the stage). */
export function ProductToggle() {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    e.stopPropagation();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + products.options.length) % products.options.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const p = products.options[active];

  return (
    <div className="rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{products.label}</p>
        <div role="tablist" aria-label="Loan product" className="flex rounded-lg border border-line bg-paper p-0.5" onKeyDown={onKey}>
          {products.options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${base}-tab-${o.id}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cx(
                "rounded-md px-3 py-1 font-mono text-[12px] transition-colors",
                i === active ? "bg-ink text-paper" : "text-muted hover:text-ink",
              )}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${p.id}`} className="px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-blueprint">{p.tag}</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink/85">{p.text}</p>
        <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
          {p.rows.map((r) => (
            <div key={r.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{r.label}</dt>
              <dd className="mt-1 font-mono text-[13px] font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-[13px] text-muted">{products.footnote}</p>
      </div>
    </div>
  );
}
