"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-cyan-400/10 rounded-full blur-3xl float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-amber-400/10 rounded-full blur-3xl float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Text */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-9xl sm:text-[12rem] font-bold gradient-text-animated mb-4">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
              Looks like this page took an unexpected route. Let&apos;s get you back on track!
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <HomeIcon className="w-5 h-5" />
              <span>Go Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-muted text-foreground font-semibold rounded-lg border-2 border-border hover:border-primary hover:scale-105 transition-all duration-300"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Popular Pages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">Or explore these sections:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: "About", href: "/#about" },
                { name: "Projects", href: "/#projects" },
                { name: "Skills", href: "/#skills" },
                { name: "Contact", href: "/#contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
