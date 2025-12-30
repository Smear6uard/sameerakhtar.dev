export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <span>© 2025 Sameer Akhtar. Built with Next.js</span>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Smear6uard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/sameer-a-akhtar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
