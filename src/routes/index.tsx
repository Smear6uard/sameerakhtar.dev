import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/hero-section";
import { WorkSection } from "@/components/sections/work-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { seo } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Sameer Akhtar — Software Engineer in Chicago",
        description: site.description,
        keywords:
          "Sameer Akhtar, software engineer, Chicago, Quantum Metric, Renaro, Styleum, HazardLens, DePaul University, new grad software engineer 2027, TypeScript, Go, React, PostgreSQL, computer vision",
        url: site.url,
      }),
    ],
    links: [{ rel: "canonical", href: site.url }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
