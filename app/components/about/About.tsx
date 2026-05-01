import { Photography } from './Photography'
import { PortraitCard } from './PortraitCard'
import { TechStack } from './TechStack'

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="location-card-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 14.5s5-4.4 5-8.5a5 5 0 0 0-10 0c0 4.1 5 8.5 5 8.5Z" />
      <circle cx="8" cy="6" r="1.8" />
    </svg>
  )
}

function GraduationCapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="education-card-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9 12 4l10 5-10 5L2 9Z" />
      <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
      <path d="M22 9v5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7h8" />
      <path d="M7.5 3.5 11 7l-3.5 3.5" />
    </svg>
  )
}

function LocationCard() {
  return (
    <div className="about-card">
      <div className="about-card-eyebrow">
        <MapPinIcon />
        <span className="about-card-eyebrow-label about-card-eyebrow-label--neutral">Location</span>
      </div>
      <h3 className="about-card-title">Chicago, IL</h3>
      <p className="about-card-sub">Open to remote · Open to relocate</p>
    </div>
  )
}

function BuildingCard() {
  return (
    <div className="about-card">
      <div className="about-card-eyebrow">
        <span className="status-dot" aria-hidden="true" />
        <span className="about-card-eyebrow-label about-card-eyebrow-label--neutral">Building</span>
      </div>
      <h3 className="about-card-title">Styleum</h3>
      <p className="about-card-sub">AI styling iOS app · $0.002 per outfit</p>
      <a
        className="about-card-link"
        href="https://apps.apple.com/styleum-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>visit</span>
        <ArrowIcon />
      </a>
    </div>
  )
}

function NewsletterCard() {
  return (
    <div className="about-card">
      <div className="about-card-eyebrow">
        <span className="about-card-eyebrow-label">Newsletter</span>
      </div>
      <span className="newsletter-card-number">500+</span>
      <span className="newsletter-card-label">subscribers</span>
      <p className="newsletter-card-desc">On shipping ML to production</p>
      <a className="about-card-link" href="#contact">
        <span>subscribe</span>
        <ArrowIcon />
      </a>
    </div>
  )
}

function EducationCard() {
  return (
    <div className="about-card education-card">
      <div className="education-card-icon-wrap" aria-hidden="true">
        <GraduationCapIcon />
      </div>
      <div>
        <h3 className="education-card-text-school">DePaul University</h3>
        <p className="education-card-text-meta">BS Mathematics &amp; Computer Science · 3.8 GPA</p>
      </div>
      <div className="education-card-stat">
        <span className="education-card-stat-number">14</span>
        <span className="education-card-stat-label">months to grad</span>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="section" aria-label="About">
      <div className="section-inner">
        <header className="section-eyebrow">
          <span className="section-eyebrow-bar" aria-hidden="true" />
          <span className="section-eyebrow-label">About</span>
        </header>

        <div className="about-grid">
          <div className="about-left">
            <PortraitCard />
            <div className="about-bio">
              <p>
                I care about the details most people skip. The animation that&apos;s 200ms faster.
                The API call that costs $0.002 instead of $0.02. The feature users don&apos;t
                notice, because it doesn&apos;t get in their way.
              </p>
              <p>When I&apos;m not shipping code, I shoot on a Fujifilm X-T30 II.</p>
            </div>
          </div>

          <div className="about-right">
            <LocationCard />
            <TechStack />
            <BuildingCard />
            <NewsletterCard />
          </div>
        </div>

        <Photography />

        <EducationCard />
      </div>
    </section>
  )
}
