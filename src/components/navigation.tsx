"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#work", label: "work" },
  { href: "#experience", label: "experience" },
  { href: "#about", label: "about" },
  { href: "/blog", label: "blog" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-primary/90 backdrop-blur-md border-b border-white/5"
          : ""
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-primary font-medium tracking-tight hover:text-accent transition-colors"
        >
          <Image
            src="/logo.png"
            alt=""
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span>sameer akhtar</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-accent link-underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Sameer-Akhtar-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent border border-accent/50 px-4 py-2 rounded hover:bg-accent/10 transition-colors"
          >
            resume
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-px bg-text-primary transition-transform ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-px bg-text-primary transition-opacity ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-px bg-text-primary transition-transform ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 min-h-screen w-full"
          style={{ backgroundColor: '#0a192f' }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-text-primary hover:text-accent transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl text-text-primary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/Sameer-Akhtar-Resume.pdf"
              target="_blank"
              className="text-xl text-accent"
            >
              resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
