"use client";

import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.pre
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-xs sm:text-sm text-accent/40 mb-8 leading-tight"
          >
            {`
    _  _    ___  _  _
   | || |  / _ \\| || |
   | || |_| | | | || |_
   |__   _| | | |__   _|
      | | | |_| |  | |
      |_|  \\___/   |_|
`}
          </motion.pre>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              This page doesn&apos;t exist
            </h1>
            <p className="text-text-secondary">
              Either I haven&apos;t built it yet, or you&apos;re testing my 404 page.
              <br />
              <span className="text-text-muted text-sm">
                (If it&apos;s the latter, thanks for snooping around.)
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-medium rounded-md hover:bg-[#ea580c] transition-all duration-200"
            >
              ← Back to safety
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-text-primary font-medium rounded-md hover:border-accent hover:text-accent transition-all duration-200"
            >
              Go back
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-sm text-text-muted font-mono"
          >
            Fun fact: HTTP 404 was named after room 404 at CERN where the web was invented.
            <br />
            <span className="text-text-muted/50">
              (okay that&apos;s probably not true, but it&apos;s a good story)
            </span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
