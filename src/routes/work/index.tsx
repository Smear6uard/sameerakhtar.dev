import { createFileRoute } from "@tanstack/react-router";
import { ProjectsSection } from "@/components/sections/projects-section";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Work | Sameer Akhtar",
        description:
          "Selected engineering projects by Sameer Akhtar, including Styleum, HazardLens, Intelligent LLM Router, and DeepCite.",
        url: "https://sameerakhtar.dev/work",
      }),
    ],
    links: [{ rel: "canonical", href: "https://sameerakhtar.dev/work" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  return <ProjectsSection />;
}
