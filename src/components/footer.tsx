"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Resume", href: "#resume" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="border-t border-border/50 bg-background/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-primary-foreground font-bold text-lg">SA</span>
              </div>
              <div>
                <h3 className="font-bold text-base gradient-text">Sameer Akhtar</h3>
                <p className="text-xs text-muted-foreground">Computer Science Student & AI Developer</p>
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>by Sameer Akhtar</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
              <span>© {currentYear} All rights reserved.</span>
              <span>•</span>
              <span>Built with Next.js & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}