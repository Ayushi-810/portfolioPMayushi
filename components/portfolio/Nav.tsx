"use client";

import Link from "next/link";
import { nav } from "@/content/portfolio";

export function Nav() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-md bg-ink px-3 py-2 text-sm text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="shrink-0 text-[15px] font-medium tracking-tight">
            {nav.name}
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-0.5 xl:flex">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-2.5 py-1.5 text-[13.5px] text-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={nav.loanCta.href}
              className="hidden rounded-full border border-blueprint/30 bg-blueprint-soft px-3 py-1.5 text-[12.5px] font-medium text-blueprint transition-colors hover:border-blueprint/60 md:inline-flex"
            >
              {nav.loanCta.label} <span aria-hidden="true">&nbsp;→</span>
            </Link>
            {/* compact menu below xl */}
            <details className="relative xl:hidden">
              <summary className="cursor-pointer list-none rounded-md border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium [&::-webkit-details-marker]:hidden">
                {nav.menu}
              </summary>
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-line bg-card p-1.5 shadow-lg">
                {nav.links.map((l) => (
                  <a key={l.href} href={l.href} className="block rounded-md px-3 py-2 text-[14px] text-ink/85 hover:bg-paper">
                    {l.label}
                  </a>
                ))}
                <Link href={nav.loanCta.href} className="mt-1 block rounded-md px-3 py-2 text-[14px] text-blueprint hover:bg-paper md:hidden">
                  {nav.loanCta.label} →
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
