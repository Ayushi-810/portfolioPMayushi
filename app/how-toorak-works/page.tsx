import type { Metadata } from "next";
import { ToorakExperience } from "@/components/toorak/ToorakExperience";
import { page } from "@/content/toorak";

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  openGraph: { title: page.title, description: page.description, url: "/how-toorak-works" },
};

export default function HowToorakWorks() {
  return <ToorakExperience />;
}
