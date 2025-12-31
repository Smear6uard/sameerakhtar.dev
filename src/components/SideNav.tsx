"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { useActiveSection } from "@/hooks/useActiveSection";

const navLinks = [
  { href: "#work", label: "work", icon: "work" },
  { href: "#experience", label: "experience", icon: "experience" },
  { href: "#about", label: "about", icon: "about" },
  { href: "/blog", label: "blog", icon: "blog" },
];

function NavIcon({ type }: { type: string }) {
  switch (type) {
    case "work":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "experience":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      );
    case "about":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case "blog":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    default:
      return null;
  }
}

export function SideNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeSection = useActiveSection();

  return (
    <motion.nav
      initial={{ x: -72 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-screen z-50 hidden md:flex flex-col bg-bg-primary/95 backdrop-blur-sm border-r border-white/5 transition-all duration-300 ease-out"
      style={{ width: isExpanded ? 200 : 72 }}
    >
      {/* Logo/Name */}
      <div className="flex items-center h-20 px-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 text-text-primary hover:text-accent transition-colors">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-sm flex-shrink-0"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium text-sm whitespace-nowrap overflow-hidden"
          >
            sameer
          </motion.span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 flex flex-col justify-center gap-2 px-3">
        {navLinks.map((link) => {
          const sectionId = link.href.replace("#", "");
          const isActive = activeSection === sectionId;

          return (
            <MagneticWrapper key={link.href} radius={70} maxDistance={6}>
              <Link
                href={link.href}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-[180ms] ease-out group
                  ${isActive
                    ? "text-accent bg-accent/10"
                    : "text-text-muted hover:text-accent hover:bg-white/5 hover:scale-105"
                  }`}
              >
                <span className="flex-shrink-0">
                  <NavIcon type={link.icon} />
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm whitespace-nowrap overflow-hidden"
                >
                  {link.label}
                </motion.span>
                {/* Tooltip - only show when collapsed */}
                {!isExpanded && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-bg-secondary text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300 pointer-events-none whitespace-nowrap z-50">
                    {link.label}
                  </span>
                )}
              </Link>
            </MagneticWrapper>
          );
        })}
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-2 px-3 pb-6 border-t border-white/5 pt-4">
        <MagneticWrapper radius={60} maxDistance={5}>
          <a
            href="https://github.com/Smear6uard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap"
            >
              github
            </motion.span>
          </a>
        </MagneticWrapper>
        <MagneticWrapper radius={60} maxDistance={5}>
          <a
            href="https://linkedin.com/in/sameer-a-akhtar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap"
            >
              linkedin
            </motion.span>
          </a>
        </MagneticWrapper>
        <MagneticWrapper radius={60} maxDistance={5}>
          <a
            href="mailto:Sameer_Akhtar@icloud.com"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6L12 13L2 6" />
            </svg>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap"
            >
              email
            </motion.span>
          </a>
        </MagneticWrapper>

        {/* Resume link */}
        <MagneticWrapper radius={60} maxDistance={5}>
          <a
            href="/Sameer-Akhtar-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-accent border border-accent/30 hover:bg-accent/10 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap"
            >
              resume
            </motion.span>
          </a>
        </MagneticWrapper>
      </div>
    </motion.nav>
  );
}
