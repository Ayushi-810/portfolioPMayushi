import Link from "next/link";
import { footer, nav, person } from "@/content/portfolio";

export function Footer() {
  const link = "underline decoration-line underline-offset-4 transition-colors hover:text-ink";
  return (
    <footer className="border-t border-line">
      <p className="mx-auto flex max-w-6xl flex-wrap gap-x-2 gap-y-1 px-5 py-10 font-mono text-[11.5px] text-muted sm:px-8">
        <span>
          © {footer.year} {person.name}
        </span>
        ·
        <Link href={nav.loanCta.href} className={link}>
          {nav.loanCta.label}
        </Link>
        ·
        <a href={person.linkedinUrl} className={link} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        ·
        <a href={person.resumeUrl} className={link} download>
          Resume
        </a>
      </p>
    </footer>
  );
}
