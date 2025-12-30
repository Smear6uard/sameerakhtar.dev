"use client";

import { motion } from "framer-motion";

const ascii = `
  ██████╗  █████╗ ███╗   ███╗███████╗███████╗██████╗
 ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔════╝██╔══██╗
 ╚█████╗  ███████║██╔████╔██║█████╗  █████╗  ██████╔╝
  ╚═══██╗ ██╔══██║██║╚██╔╝██║██╔══╝  ██╔══╝  ██╔══██╗
 ██████╔╝ ██║  ██║██║ ╚═╝ ██║███████╗███████╗██║  ██║
 ╚═════╝  ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
`;

export function AsciiArt() {
  return (
    <motion.pre
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="font-mono text-accent text-[10px] sm:text-sm md:text-base lg:text-lg leading-none select-none animate-breathe whitespace-pre"
    >
      {ascii}
    </motion.pre>
  );
}
