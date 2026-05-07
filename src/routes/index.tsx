// Home page — equivalent of `src/app/page.tsx` in the old Next.js app.

import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/hero-section";
import { PerceptionSection } from "@/components/sections/perception-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Sameer Akhtar | Software Engineer & Founder",
        description:
          "Founder of Styleum — AI outfit generation at $0.002/call. Software engineering intern at Brunosoft. Math & CS at DePaul University. Previously Apple.",
        keywords:
          "Sameer Akhtar, Software Engineer, Full Stack Developer, Founder, Styleum, Startup Founder, AI Developer, iOS Developer, Swift Developer, React Developer, Next.js Developer, TypeScript, JavaScript, Python, Machine Learning, Computer Vision, DePaul University, Chicago Developer, Tech Entrepreneur",
        image: "https://sameerakhtar.dev/SameerAkhtar.dev-logo-navybg.jpg",
        url: "https://sameerakhtar.dev",
      }),
    ],
    links: [{ rel: "canonical", href: "https://sameerakhtar.dev" }],
  }),
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
