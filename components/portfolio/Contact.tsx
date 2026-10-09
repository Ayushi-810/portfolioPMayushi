"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { AccentText, Eyebrow } from "@/components/ui";
import { contact, person } from "@/content/portfolio";

const EASE = [0.22, 1, 0.36, 1] as const;

function Signature({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 320 70" className="h-16 w-full max-w-xs" role="img" aria-label={`Signed: ${person.name}`}>
      <motion.text
        x="6"
        y="52"
        fontFamily="var(--font-instrument-serif), serif"
        fontStyle="italic"
        fontSize="48"
        stroke="var(--ink)"
        strokeWidth="0.9"
        strokeDasharray="900"
        initial={reduced ? false : { strokeDashoffset: 900, fill: "rgba(14,17,22,0)" }}
        animate={{ strokeDashoffset: 0, fill: "rgba(14,17,22,1)" }}
        transition={{
          strokeDashoffset: { duration: 1.6, ease: "easeInOut" },
          fill: { duration: 0.5, delay: 1.3 },
        }}
      >
        {person.name}
      </motion.text>
    </svg>
  );
}

export function Contact() {
  const reduced = useReducedMotion() ?? false;
  const [signed, setSigned] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setToast(true);
    } catch {}
  };

  const t = (d: number) => (reduced ? 0 : d);

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
      {/* the curtains open as the section enters */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 border-r border-line bg-blueprint-soft"
        initial={{ x: 0 }}
        whileInView={{ x: "-100%" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 border-l border-line bg-blueprint-soft"
        initial={{ x: 0 }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow className="justify-center">{contact.eyebrow}</Eyebrow>
        <h2 id="contact-title" className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          <AccentText text={contact.headline} />
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[17px] text-muted">{contact.sub}</p>

        {/* the document */}
        <div className="relative mx-auto mt-12 max-w-xl rounded-2xl border border-line bg-card p-6 text-left shadow-[0_1px_2px_rgba(14,17,22,0.04),0_30px_60px_-30px_rgba(14,17,22,0.25)] sm:p-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">{contact.doc.title}</p>
          <ul className="mt-4 space-y-1.5 font-mono text-[12.5px] text-ink/80">
            {contact.doc.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>

          <div className="mt-8 flex min-h-16 items-end">{signed && <Signature reduced={reduced} />}</div>
          <div className="border-t border-ink/40 pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            ✕ {contact.doc.signHere}
          </div>

          <AnimatePresence>
            {signed && (
              <motion.p
                className="absolute right-6 top-6 rotate-[-10deg] rounded-md border-2 border-pass px-3 py-1 font-mono text-[15px] font-bold uppercase tracking-[0.16em] text-pass sm:right-8"
                initial={{ opacity: 0, scale: 2.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: t(0.35), delay: t(1.6), ease: [0.34, 1.56, 0.64, 1] }}
              >
                {contact.doc.closed} ✓
              </motion.p>
            )}
          </AnimatePresence>

          {!signed ? (
            <button
              type="button"
              onClick={() => setSigned(true)}
              className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-ink/85"
            >
              {contact.doc.sign}
            </button>
          ) : (
            <motion.div
              className="mt-6 grid gap-2 sm:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: t(0.5), delay: t(2), ease: EASE }}
            >
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-2.5 sm:col-span-3">
                <a href={`mailto:${person.email}`} className="truncate text-[14.5px] font-medium hover:text-blueprint">
                  <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{contact.email}</span>
                  {person.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="shrink-0 rounded-md border border-line px-2.5 py-1 font-mono text-[11px] hover:border-ink/30"
                >
                  {contact.copy}
                </button>
              </div>
              <a
                href={person.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-line px-3.5 py-2.5 text-center text-[14px] font-medium hover:border-ink/30 sm:col-span-1"
              >
                {contact.linkedin} ↗
              </a>
              <a
                href={person.resumeUrl}
                download
                className="rounded-xl bg-ink px-3.5 py-2.5 text-center text-[14px] font-medium text-paper hover:bg-ink/85 sm:col-span-2"
              >
                {contact.resume} ↓
              </a>
            </motion.div>
          )}
        </div>

        {/* always-available plain links */}
        <p className="mt-8 font-mono text-[12px] text-muted">{contact.plain}</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[15px]">
          <a href={`mailto:${person.email}`} className="underline decoration-line underline-offset-4 hover:text-blueprint">
            {person.email}
          </a>
          <a href={person.linkedinUrl} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-blueprint">
            {person.linkedin}
          </a>
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {toast ? contact.copied : ""}
      </p>
      <AnimatePresence>
        {toast && (
          <motion.p
            aria-hidden="true"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-mono text-[12px] text-paper shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {contact.copied} ✓
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
