interface SeoOptions {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function seo({ title, description, keywords, image, url, type = "website" }: SeoOptions) {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@sameerakhtar" },
    { name: "twitter:site", content: "@sameerakhtar" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: image },
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: "Sameer Akhtar" },
    { property: "og:locale", content: "en_US" },
  ].filter((t) => {
    if ("content" in t) {
      return typeof t.content === "string" && t.content.length > 0;
    }
    return true;
  });

  return tags;
}
