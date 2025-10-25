"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bars3Icon, 
  XMarkIcon
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Skills", href: "/#skills" },
  { name: "Resume", href: "/#resume" },
  { name: "Contact", href: "/#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -35% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) {
            setActiveSection(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-h-[48px]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-primary-foreground font-bold text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">SA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg gradient-text tracking-tight group-hover:scale-105 transition-transform duration-300">
                Sameer Akhtar
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300 hidden sm:block">
                Software Engineer
              </span>
            </div>
          </Link>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                      const sectionId = item.href.replace("/#", "") || "home";
                      const isActive = activeSection === sectionId || (activeSection === "" && sectionId === "home");

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => handleNavClick(item.href)}
                          className={`text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 relative group ${
                            isActive
                              ? "gradient-text bg-primary/10 dark:bg-primary/20 shadow-md"
                              : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                          }`}
                        >
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
                 <button
                   onClick={() => setIsOpen(!isOpen)}
                   className="md:hidden p-3 rounded-xl bg-muted hover:bg-primary/10 border border-border dark:border-white/10 hover:scale-110 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer min-h-[48px] min-w-[48px] flex items-center justify-center"
                   aria-label="Toggle menu"
                 >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => {
                          const sectionId = item.href.replace("/#", "") || "home";
                          const isActive = activeSection === sectionId || (activeSection === "" && sectionId === "home");

                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => handleNavClick(item.href)}
                              className={`block px-4 py-3 rounded-md text-base font-medium hover:scale-105 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 min-h-[48px] flex items-center ${
                                isActive
                                  ? "gradient-text bg-primary/10 dark:bg-primary/20"
                                  : "text-foreground hover:text-primary hover:bg-primary/5"
                              }`}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
