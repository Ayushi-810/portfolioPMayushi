"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { glossary, page } from "@/content/toorak";

export function Glossary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
    return needle ? sorted.filter((g) => `${g.term} ${g.text}`.toLowerCase().includes(needle)) : sorted;
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // keep focus inside the drawer
      if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button, input, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="glossary-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="glossary-title" className="text-lg font-medium">
                {page.glossaryLabel}
              </h2>
              <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-muted hover:text-ink">
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="border-b border-line px-5 py-3">
              <label htmlFor="glossary-q" className="sr-only">
                Search terms
              </label>
              <input
                id="glossary-q"
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${glossary.length} terms…`}
                className="w-full rounded-lg border border-line bg-card px-3 py-2 text-[14px] outline-none focus:border-blueprint"
              />
            </div>
            <dl className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((g) => (
                <div key={g.term} className="py-3">
                  <dt className="text-[14.5px] font-medium">{g.term}</dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-muted">{g.text}</dd>
                </div>
              ))}
              {items.length === 0 && <p className="py-6 text-[14px] text-muted">No matching terms.</p>}
            </dl>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
