"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  CodeBracketIcon, 
  RocketLaunchIcon, 
  LightBulbIcon,
  HeartIcon 
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: CodeBracketIcon,
    title: "Clean Code",
    description: "Maintainable, scalable code following industry best practices."
  },
  {
    icon: RocketLaunchIcon,
    title: "Performance",
    description: "Fast, responsive applications optimized for user experience."
  },
  {
    icon: LightBulbIcon,
    title: "Innovation",
    description: "Creative solutions using cutting-edge technologies."
  },
  {
    icon: HeartIcon,
    title: "Collaboration",
    description: "Team player focused on delivering exceptional results."
  }
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          className="max-w-6xl mx-auto"
        >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Computer Science student at DePaul University passionate about AI development,
            building scalable web applications, and creating innovative solutions that solve real-world problems.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12">
          {/* Left Column - Story */}
          <motion.div variants={itemVariants} className="space-y-6 sm:space-y-7 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">My Story</h3>
            <p className="text-gray-700 dark:text-muted-foreground leading-relaxed text-sm sm:text-base">
              I&apos;m a Computer Science student at DePaul University with a 3.8 GPA, currently working as a Software Engineering Intern at BRUNOSOFT and serving as an Apple Specialist.
              I specialize in AI development, modernizing legacy codebases, and building scalable web applications.
            </p>
            <p className="text-gray-700 dark:text-muted-foreground leading-relaxed text-sm sm:text-base">
              With expertise in JavaScript, Python, React, Next.js, and AI technologies, I&apos;ve built production applications processing 100+ URLs/hour with 98% accuracy.
              I&apos;m passionate about creating innovative solutions that solve real-world problems.
            </p>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 sm:gap-6">
            <motion.div 
              className="text-center p-4 sm:p-6 modern-card group interactive-hover"
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">3.8</div>
              <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">GPA</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 sm:p-6 modern-card group interactive-hover"
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">4+</div>
              <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">AI Projects</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 sm:p-6 modern-card group interactive-hover"
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
              <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Technologies</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 sm:p-6 modern-card group interactive-hover"
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">Accuracy Rate</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-4 sm:p-6 modern-card group interactive-hover"
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className="p-2 sm:p-3 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl w-fit mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 dark:text-muted-foreground text-xs sm:text-sm leading-relaxed group-hover:text-gray-800 dark:group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
