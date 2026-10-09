"use client";

import type { ReactNode } from "react";
import { AccentText, Eyebrow, cx } from "@/components/ui";
import type { Accent } from "@/content/portfolio";
import { Rise } from "./page-state";

/** Eyebrow + one-accent headline + body, with generous spacing. */
export function Section({
  id,
  eyebrow,
  headline,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  headline: Accent;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx("border-t border-line py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="mt-5 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-balance sm:text-[3.4rem]">
            <AccentText text={headline} />
          </h2>
        </Rise>
        {children}
      </div>
    </section>
  );
}
