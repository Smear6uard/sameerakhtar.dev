"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  CodeBracketIcon
} from "@heroicons/react/24/outline";

const projects = [
  {
    id: 1,
    title: "AI Answer Engine",
    description: "Built production Next.js app processing 100+ URLs/hour with ~98% accuracy using Cheerio, Axios, and Puppeteer for dynamic content extraction. Integrated Groq SDK for AI-powered Q&A, achieving 40% faster responses than baseline LLMs. Deployed on Vercel handling 1,000+ queries with <2 second response times, cutting research time by 60%.",
    gradient: "from-violet-500/15 to-cyan-500/20",
    technologies: ["Next.js", "Groq SDK", "Cheerio", "Axios", "Puppeteer", "Vercel"],
    githubUrl: "https://github.com/Smear6uard/AI-Answer-Engine",
    liveUrl: "https://ai-answer-engine.vercel.app",
    image: undefined // Add screenshot path here when available
  },
  {
    id: 2,
    title: "AI Chrome Extension",
    description: "Built Chrome extension with real-time AI autocomplete achieving under 200ms latency, tested across 20+ websites. Implemented local caching and context detection, reducing API calls by 50% while maintaining 90%+ accuracy. Designed secure API key management system using Chrome Storage API, eliminating exposure risks in public repository.",
    gradient: "from-emerald-500/15 to-amber-500/20",
    technologies: ["Chrome Extension", "JavaScript", "Chrome Storage API", "AI Integration"],
    githubUrl: "https://github.com/Smear6uard/AI-Chrome-Extension",
    image: undefined // Add screenshot path here when available
  },
  {
    id: 3,
    title: "Mock Stock Exchange Platform",
    description: "Engineered modular price, order, and quote classes simulating trades for 100+ users and 1,000+ trade events per session. Built a real-time matching engine executing 500+ trades per session, with millisecond-level order-book updates. Implemented user management, portfolio tracking, and transaction history with live balance validation.",
    gradient: "from-blue-500/15 to-indigo-500/20",
    technologies: ["Java", "Object-Oriented Design", "Real-time Systems", "Unit Testing"],
    githubUrl: "https://github.com/Smear6uard/Mock-Stock-Exchange",
    image: undefined // Add screenshot path here when available
  },
  {
    id: 4,
    title: "Intelligent LLM Router",
    description: "Designed an LLM router processing 1K+ prompts/hr, optimizing model selection to cut API costs by up to 40%. Integrated analytics for A/B testing across 3+ LLMs, displaying evaluation reports instantly for comparison. Engineered modular configuration supporting rapid integration of additional model APIs in < 10 minutes each.",
    gradient: "from-purple-500/15 to-pink-500/20",
    technologies: ["Python", "LLM Integration", "A/B Testing", "Analytics", "API Optimization"],
    githubUrl: "https://github.com/Smear6uard/Intelligent-LLM-Router",
    image: undefined // Add screenshot path here when available
  }
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div ref={ref} className="section-spacing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Here are my AI and software development projects that showcase my skills and passion for
            creating innovative digital solutions.
          </p>
        </motion.div>

        {/* Modern Grid Layout */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto"
        >
          {projects.map((project) => (
       <motion.div
         key={project.id}
         variants={itemVariants}
         className="group relative modern-card overflow-hidden interactive-hover"
         whileHover={{ 
           scale: 1.05, 
           y: -12,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />

              {/* Subtle Border */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-white/20 transition-colors duration-300" />

              {/* Project Image (if available) */}
              {project.image && (
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              )}

              {/* Content Container */}
              <div className={`relative h-full flex flex-col p-4 sm:p-6 lg:p-8 ${project.image ? 'min-h-[240px]' : 'min-h-[280px] sm:min-h-[320px]'}`}>

                {/* Header */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-4">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {project.description}
                </p>

                {/* Technologies - Pushed to bottom */}
                <div className="mt-auto space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-white/10 backdrop-blur-sm text-gray-800 dark:text-foreground text-xs sm:text-sm font-medium rounded-lg border border-gray-300 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Links */}
                  <div className="flex gap-3 pt-3 sm:pt-4 border-t border-white/10">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:scale-105 transition-all duration-300 group/link"
                    >
                      <CodeBracketIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:scale-110 group-hover/link:rotate-12 transition-transform duration-300" />
                      <span>GitHub</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary hover:scale-105 transition-all duration-300 group/link"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:scale-110 group-hover/link:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
