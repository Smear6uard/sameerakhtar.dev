"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDownTrayIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { GithubIcon, LinkedinIcon, X } from "lucide-react";

export function HeroSection() {
  const [displayedName, setDisplayedName] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [mounted, setMounted] = useState(false);
  const fullName = "Sameer Akhtar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let currentIndex = 0;
    const typingSpeed = 150; // milliseconds per character
    
    const typeWriter = () => {
      if (currentIndex < fullName.length) {
        setDisplayedName(fullName.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    // Start typing after a short delay
    const startTyping = setTimeout(typeWriter, 1000);
    
    return () => clearTimeout(startTyping);
  }, [mounted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="min-h-[100vh] flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-950 to-blue-950/90" />

      {/* Animated gradient orbs with more movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-violet-400/15 to-cyan-400/15 dark:from-violet-500/5 dark:to-cyan-500/5 rounded-full blur-3xl float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-amber-400/15 dark:from-emerald-500/5 dark:to-amber-500/5 rounded-full blur-3xl float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-rose-400/10 to-violet-400/10 dark:from-rose-500/3 dark:to-violet-500/3 rounded-full blur-2xl float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 dark:bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center"
        >
          {/* Left Column - Text Content */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 text-center lg:text-left">
            <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-200 dark:text-gray-100"
                variants={itemVariants}
              >
                Hi, I&apos;m{" "}
                <span className="gradient-text-animated">
                  {mounted ? displayedName : fullName}
                  {mounted && isTyping && <span className="typewriter-cursor">|</span>}
                </span>
              </motion.h1>
                <motion.h2
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 dark:text-gray-200 font-medium"
                  variants={itemVariants}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: mounted && !isTyping ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Computer Science Student & AI Developer
                </motion.h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-300 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted && !isTyping ? 1 : 0 }}
              transition={{ delay: 1 }}
            >
              I create innovative AI-powered solutions and web applications.
              Passionate about computer science, machine learning, and building
              technologies that solve real-world problems.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
                 <motion.a
                   href="/Sameer-Akhtar-Resume.pdf"
                   download
                   className="relative inline-flex items-center justify-center group overflow-hidden rounded-xl px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-500/30 dark:border-blue-400/40"
                   whileHover={{ 
                     scale: 1.08, 
                     y: -4,
                     boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                   }}
                   whileTap={{ scale: 0.95 }}
                   animate={{
                     boxShadow: [
                       "0 10px 30px rgba(59, 130, 246, 0.3)",
                       "0 15px 35px rgba(59, 130, 246, 0.4)",
                       "0 10px 30px rgba(59, 130, 246, 0.3)"
                     ]
                   }}
                   transition={{
                     boxShadow: {
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }
                   }}
                 >
                   {/* Animated background gradient */}
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   
                   {/* Shimmer effect */}
                   <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                   
                   <ArrowDownTrayIcon className="relative w-5 h-5 mr-3 group-hover:translate-y-1 group-hover:rotate-12 transition-all duration-300" />
                   <span className="relative">Download Resume</span>
                   
                   {/* Floating particles */}
                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                   <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.5s' }} />
                 </motion.a>

                 <motion.a
                   href="#contact"
                   className="relative inline-flex items-center justify-center group overflow-hidden rounded-xl px-8 py-4 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-300 dark:text-gray-200 font-semibold border-2 border-gray-600 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
                   whileHover={{ 
                     scale: 1.08, 
                     y: -4,
                     boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)"
                   }}
                   whileTap={{ scale: 0.95 }}
                 >
                   {/* Animated background */}
                   <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   
                   {/* Shimmer effect */}
                   <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                   
                   <EnvelopeIcon className="relative w-5 h-5 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                   <span className="relative">Get In Touch</span>
                   
                   {/* Floating particles */}
                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                   <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-indigo-500/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.3s' }} />
                 </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 justify-center lg:justify-start"
            >
                <motion.a
                  href="https://github.com/Smear6uard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link hover:scale-125 hover:rotate-12 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/sameer-a-akhtar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link hover:scale-125 hover:rotate-12 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="mailto:Sameer_Akhtar@icloud.com"
                  className="social-link hover:scale-125 hover:rotate-12 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Email"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="https://x.com/s_ameer_akhtar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link hover:scale-125 hover:rotate-12 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="X (Twitter)"
                >
                  <X className="w-5 h-5" />
                </motion.a>
            </motion.div>
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-end order-first lg:order-last mb-8 lg:mb-0"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative w-[12rem] h-[12rem] sm:w-[16rem] sm:h-[16rem] md:w-[20rem] md:h-[20rem] lg:w-[28rem] lg:h-[28rem]"
              >
                {/* Enhanced glow effect with animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-400/40 via-cyan-400/30 to-emerald-400/40 dark:from-violet-500/40 dark:via-cyan-500/30 dark:to-emerald-500/40 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-violet-400/40 dark:border-violet-500/40"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Profile Image Container */}
                <motion.div 
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 dark:border-white/10 shadow-2xl dark:shadow-black/40 group"
                  whileHover={{
                    scale: 1.08,
                    rotateY: 8,
                    boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.5)"
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src="/LinkedIn pic.jpg"
                    alt="Sameer Akhtar"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Floating elements around the image */}
                <motion.div
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  animate={{
                    y: [5, -5, 5],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  💻
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
