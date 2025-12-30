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
      className="font-mono text-accent text-[7px] sm:text-[10px] md:text-sm lg:text-base leading-none select-none animate-breathe whitespace-pre overflow-x-auto"
    >
      {ascii}
    </motion.pre>
  );
}
