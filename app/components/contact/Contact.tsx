import { useEffect, useRef, useState } from 'react'

const EMAIL = 'sameer@sameerakhtar.dev'

const SECONDARY_LINKS = [
  { label: 'github', href: 'https://github.com/sameerakhtar' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/sameerakhtar' },
  { label: 'twitter', href: 'https://twitter.com/sameerakhtar' },
  { label: 'resume', href: '/Sameer_Akhtar_Resume.pdf' },
] as const

function MailIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="contact-email-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="3" width="11" height="8" rx="1" />
      <path d="m1.5 3.6 5.5 4 5.5-4" />
    </svg>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    if (typeof navigator === 'undefined') return
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="section-inner">
        <header className="section-eyebrow">
          <span className="section-eyebrow-bar" aria-hidden="true" />
          <span className="section-eyebrow-label">Contact</span>
        </header>

        <h2 className="contact-headline">I&apos;m always up to chat.</h2>

        <p className="contact-body">
          I&apos;m looking for Summer 2026 opportunities in software engineering or AI/ML. Currently
          based in Chicago, open to remote and relocation. If you&apos;re working on computer
          vision, perception systems, or anything at the intersection of math and product, I&apos;d
          love to hear from you.
        </p>

        <div className="contact-actions">
          <button
            type="button"
            className="contact-email-button"
            onClick={() => {
              void handleCopy()
            }}
            aria-label={`Copy email address ${EMAIL}`}
          >
            <MailIcon />
            <span>{EMAIL}</span>
          </button>

          <span
            className={`contact-copied ${copied ? 'contact-copied--visible' : ''}`}
            aria-live="polite"
          >
            {copied ? 'copied' : ''}
          </span>

          <div className="contact-secondary">
            {SECONDARY_LINKS.map((link, i) => (
              <span key={link.label} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <a
                  href={link.href}
                  className="contact-secondary-link"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
                {i < SECONDARY_LINKS.length - 1 && (
                  <span className="contact-secondary-sep" aria-hidden="true">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
