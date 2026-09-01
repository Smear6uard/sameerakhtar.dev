import { Reveal } from "@/components/ui/Reveal";
import { education, honors, skills } from "@/lib/resume";
import { site } from "@/lib/site";

const photos = [
  {
    base: "/photography/photo-1",
    alt: "Chicago skyline silhouetted at golden hour",
    caption: "Lakefront, golden hour",
  },
  {
    base: "/photography/photo-2",
    alt: "Wrigley Field under stadium lights at dusk",
    caption: "Wrigley, under the lights",
  },
  {
    base: "/photography/photo-3",
    alt: "Stone church in a mountain valley in warm haze",
    caption: "Alpine village, late summer",
  },
  {
    base: "/photography/photo-4",
    alt: "Red brick church against a mountain range",
    caption: "Mountain light",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="wrap pt-20 md:pt-28">
      <Reveal>
        <p className="eyebrow">About</p>
      </Reveal>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <img
            src="/profile.jpg"
            alt="Sameer Akhtar"
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
            className="aspect-[3/4] w-full rounded-2xl object-cover object-[center_20%]"
          />
          <p className="mt-3 font-mono text-xs text-ink-3">{site.location}</p>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal>
            <h2 className="display-lg max-w-[22ch]">
              I like the unglamorous parts: the retry path, the schema gate, the contrast check.
            </h2>
            <p className="lede mt-6 max-w-[62ch]">
              I&apos;m a junior at DePaul studying mathematics and computer science, and I&apos;ve
              spent the last year shipping software other people depend on: a GenAI feature at
              Quantum Metric, a dispatch platform for fleet operators, and an iOS app with a
              hundred-plus daily users. Products stop being demos in the unglamorous parts, so that
              is where I spend my time.
            </p>
            <p className="mt-4 max-w-[62ch] text-ink-2">
              Outside of work I co-founded the Muslim Tech Founders newsletter, won DemonHacks 2026
              with a team of six, and shoot on a Fujifilm X-T30 II. The colors on this site are
              sampled from those photographs.
            </p>
          </Reveal>

          <Reveal className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Education</p>
              <p className="mt-2 text-ink">{education.school}</p>
              <p className="text-sm text-ink-2">
                {education.degree} · GPA {education.gpa}
              </p>
              <p className="text-sm text-ink-3">{education.expected}</p>
            </div>
            <div>
              <p className="eyebrow">Coursework</p>
              <p className="mt-2 text-sm text-ink-2">{education.coursework}</p>
            </div>
            {honors.map((honor) => (
              <div key={honor.title}>
                <p className="eyebrow">{honor.when}</p>
                <p className="mt-2 text-ink">
                  <a
                    href={honor.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {honor.title} <span aria-hidden="true">↗</span>
                  </a>
                </p>
                <p className="text-sm text-ink-2">{honor.detail}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="hairline mt-10 pt-8">
            <p className="eyebrow">Tools I reach for</p>
            <dl className="mt-4 grid gap-y-3">
              {skills.map((group) => (
                <div key={group.label} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm text-ink-3">{group.label}</dt>
                  <dd className="text-sm text-ink-2">{group.items}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-14">
        <ul className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {photos.map((photo) => (
            <li key={photo.base} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${photo.base}-thumb.webp 640w, ${photo.base}.webp 1800w`}
                  sizes="(min-width: 768px) 25vw, 72vw"
                />
                <img
                  src={`${photo.base}-thumb.jpg`}
                  srcSet={`${photo.base}-thumb.jpg 640w, ${photo.base}.jpg 1800w`}
                  sizes="(min-width: 768px) 25vw, 72vw"
                  alt={photo.alt}
                  width={1800}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full rounded-xl object-cover"
                />
              </picture>
              <p className="mt-2 font-mono text-[11px] text-ink-3">{photo.caption}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
