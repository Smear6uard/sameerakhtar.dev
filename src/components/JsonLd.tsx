export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sameer Akhtar",
    url: "https://sameerakhtar.dev",
    image: "https://sameerakhtar.dev/profile.jpg",
    sameAs: ["https://github.com/Smear6uard", "https://linkedin.com/in/sameer-a-akhtar"],
    jobTitle: "Software Engineer & Founder",
    worksFor: {
      "@type": "Organization",
      name: "Styleum",
      url: "https://apps.apple.com/us/app/styleum-daily-fits/id6757777880",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "DePaul University",
    },
    knowsAbout: [
      "Software Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "Swift",
      "SwiftUI",
      "Machine Learning",
      "Computer Vision",
      "AI Development",
      "iOS Development",
      "Startup Founding",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sameer Akhtar",
    url: "https://sameerakhtar.dev",
    description:
      "Founder of Styleum — AI outfit generation at $0.002/call. Software engineering intern at Brunosoft. Math & CS at DePaul. Previously Apple.",
    author: {
      "@type": "Person",
      name: "Sameer Akhtar",
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Sameer Akhtar",
      description:
        "Software Engineer and Founder building Styleum. Mathematics & Computer Science at DePaul University.",
      image: "https://sameerakhtar.dev/profile.jpg",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
    </>
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export function ProjectJsonLd({
  title,
  description,
  url,
  datePublished,
  author,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: "https://sameerakhtar.dev",
    },
    publisher: {
      "@type": "Person",
      name: author,
      url: "https://sameerakhtar.dev",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
