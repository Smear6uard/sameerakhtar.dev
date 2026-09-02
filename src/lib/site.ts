// Single source of truth for identity, links, and availability copy.
// Everything user-facing that could change with a new résumé lives here.

export const site = {
  name: "Sameer Akhtar",
  firstName: "Sameer",
  title: "Software Engineer",
  url: "https://sameerakhtar.dev",
  email: "sameer@sameerakhtar.dev",
  location: "Chicago, IL",
  github: "https://github.com/Smear6uard",
  githubHandle: "Smear6uard",
  linkedin: "https://linkedin.com/in/sameer-a-akhtar",
  resume: "/Sameer_Akhtar_Resume.pdf",
  newsletter: "https://sameerakhtar.substack.com",
  sourceRepo: "https://github.com/Smear6uard/sameerakhtar.dev",
  availability: "Open to 2027 new-grad software engineering roles · remote or Chicago",
  graduation: "July 2027",
  description:
    "Sameer Akhtar is a software engineer and founder in Chicago. Software engineering intern at Quantum Metric, founder of Renaro, creator of Styleum. Math & CS at DePaul, class of 2027.",
  ogImage: "https://sameerakhtar.dev/og-image.jpg",
} as const;

export const links = {
  renaro: "https://renaroapp.com",
  styleum: "https://styleum.xyz",
  styleumAppStore: "https://apps.apple.com/us/app/styleum-daily-fits/id6757777880",
  hazardlens: "https://github.com/Smear6uard/HazardLens",
  hazardlensDemo: "https://github.com/user-attachments/assets/c36a70f1-c5b4-46b8-842d-a4722a1f30ca",
  windwalk: "https://devpost.com/software/windwalk",
  llmRouter: "https://github.com/Smear6uard/Intelligent-LLM-Router",
  deepcite: "https://github.com/Smear6uard/DeepCite",
  deepciteLive: "https://deep-cite-git-main-sameer-akhtars-projects.vercel.app/",
} as const;
