import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ResumeSection } from "@/components/sections/resume-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section id="about">
        <AboutSection />
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="skills">
        <SkillsSection />
      </section>
      <section id="resume">
        <ResumeSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}
