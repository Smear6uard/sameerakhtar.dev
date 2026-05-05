// Home page — equivalent of `src/app/page.tsx` in the old Next.js app.

import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/hero-section";
import { PerceptionSection } from "@/components/sections/perception-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <PerceptionSection />
      <ProjectsSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
