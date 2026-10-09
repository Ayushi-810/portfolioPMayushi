import { About } from "@/components/portfolio/About";
import { CaseStudies } from "@/components/portfolio/CaseStudies";
import { Contact } from "@/components/portfolio/Contact";
import { Education } from "@/components/portfolio/Education";
import { Experience } from "@/components/portfolio/Experience";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { INTRO_KEY } from "@/components/portfolio/keys";
import { Nav } from "@/components/portfolio/Nav";
import { Opening } from "@/components/portfolio/Opening";
import { PageProvider } from "@/components/portfolio/page-state";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";

// Runs before first paint: returning visitors (or reduced motion) never see the opening flash.
const introScript = `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.introSeen="1"}catch(e){}`;

export default function Home() {
  return (
    <PageProvider>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <Opening />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <CaseStudies />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </PageProvider>
  );
}
