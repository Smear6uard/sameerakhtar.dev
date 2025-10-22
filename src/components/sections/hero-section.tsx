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
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-950/95 dark:via-gray-900/90 dark:to-gray-950/95" />

      {/* Animated gradient orbs with more movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 dark:from-cyan-500/40 dark:to-blue-600/40 rounded-full blur-3xl float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-600/40 dark:to-pink-600/40 rounded-full blur-3xl float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/8 to-pink-500/8 dark:from-orange-500/30 dark:to-pink-600/30 rounded-full blur-2xl float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
        >
          {/* Left Column - Text Content */}
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground"
                variants={itemVariants}
              >
                Hi, I&apos;m{" "}
                <span className="gradient-text-animated">
                  {mounted ? displayedName : fullName}
                  {mounted && isTyping && <span className="typewriter-cursor">|</span>}
                </span>
              </motion.h1>
                <motion.h2
                  className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium"
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
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
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
              className="flex flex-col sm:flex-row gap-4"
            >
                 <motion.a
                   href="/Sameer-Akhtar-Resume.pdf"
                   download
                   className="btn-primary inline-flex items-center justify-center group bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/20 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <ArrowDownTrayIcon className="w-5 h-5 mr-2 group-hover:translate-y-0.5 group-hover:rotate-12 transition-transform duration-300" />
                   <span>Download Resume</span>
                 </motion.a>

                 <motion.a
                   href="#contact"
                   className="btn-secondary inline-flex items-center justify-center group hover:scale-105 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <EnvelopeIcon className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                   <span>Get In Touch</span>
                 </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4"
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
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative w-[20rem] h-[20rem] sm:w-[24rem] sm:h-[24rem] lg:w-[28rem] lg:h-[28rem]"
              >
                {/* Enhanced glow effect with animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 via-purple-400/30 to-pink-400/40 dark:from-cyan-500/40 dark:via-purple-500/30 dark:to-pink-500/40 rounded-full blur-2xl"
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
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/40 dark:border-cyan-500/40"
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
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
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
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
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
