"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  CodeBracketIcon, 
  ServerIcon, 
  WrenchScrewdriverIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const skillCategories = [
  {
    title: "Programming Languages",
    icon: CodeBracketIcon,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/40",
    skills: [
      { name: "JavaScript", level: "Proficient", project: "3+ years experience" },
      { name: "Python", level: "Proficient", project: "2+ years experience" },
      { name: "Java", level: "Proficient", project: "2+ years experience" },
      { name: "Swift", level: "Intermediate", project: "1+ years experience" },
      { name: "SQL", level: "Beginner", project: "1+ years experience" },
      { name: "PHP", level: "Beginner", project: "6 months experience" },
    ]
  },
  {
    title: "Technologies & Tools",
    icon: ServerIcon,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/40",
    skills: [
      { name: "React", level: "Proficient", project: "Web Applications" },
      { name: "Next.js", level: "Proficient", project: "AI Answer Engine" },
      { name: "Node.js", level: "Proficient", project: "Backend Development" },
      { name: "AWS", level: "Proficient", project: "Cloud Development" },
      { name: "Langchain", level: "Proficient", project: "AI Integration" },
      { name: "Docker", level: "Proficient", project: "Containerization" },
      { name: "Kubernetes", level: "Proficient", project: "Orchestration" },
      { name: "iOS", level: "Intermediate", project: "Mobile Development" },
      { name: "Bootstrap", level: "Proficient", project: "UI Framework" },
      { name: "Git", level: "Expert", project: "Version Control" },
      { name: "Bash", level: "Proficient", project: "Scripting" },
    ]
  },
  {
    title: "AI & Web Development",
    icon: WrenchScrewdriverIcon,
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/40",
    skills: [
      { name: "Groq SDK", level: "Proficient", project: "AI Integration" },
      { name: "Cheerio", level: "Proficient", project: "Web Scraping" },
      { name: "Axios", level: "Proficient", project: "HTTP Client" },
      { name: "Puppeteer", level: "Proficient", project: "Dynamic Scraping" },
      { name: "Chrome Extension", level: "Proficient", project: "Browser Extension" },
      { name: "Chrome Storage API", level: "Proficient", project: "Data Management" },
      { name: "Vercel", level: "Proficient", project: "Deployment" },
    ]
  }
];

export function SkillsSection() {
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
          className="max-w-6xl mx-auto"
        >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            A comprehensive overview of my technical skills and the technologies
            I work with to build exceptional digital experiences.
          </p>
        </motion.div>

        {/* Skills by Category */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {skillCategories.map((category, categoryIndex) => (
       <motion.div
         key={categoryIndex}
         variants={itemVariants}
         className="modern-card p-4 sm:p-6 lg:p-8 interactive-hover"
         whileHover={{
           y: -8,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
                {/* Category Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${category.bgColor} hover:shadow-md border border-border/50 transition-all duration-300 group`}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                          {skill.name}
                        </span>
                        <span className="text-xs text-gray-700 dark:text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-foreground/80 transition-colors duration-300 truncate">
                          {skill.project}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {skill.level === 'Expert' && (
                          <StarIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                            categoryIndex === 0 ? 'text-blue-500 fill-blue-500 dark:text-blue-400 dark:fill-blue-400' :
                            categoryIndex === 1 ? 'text-teal-500 fill-teal-500 dark:text-teal-400 dark:fill-teal-400' :
                            'text-indigo-500 fill-indigo-500 dark:text-indigo-400 dark:fill-indigo-400'
                          } group-hover:scale-110 transition-transform duration-300`} />
                        )}
                        <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                          skill.level === 'Expert'
                            ? categoryIndex === 0
                              ? 'bg-blue-600 dark:bg-blue-800/50 text-white border border-blue-700 dark:border-blue-600/50 group-hover:bg-blue-700 dark:group-hover:bg-blue-700/60'
                              : categoryIndex === 1
                              ? 'bg-teal-600 dark:bg-teal-800/50 text-white border border-teal-700 dark:border-teal-600/50 group-hover:bg-teal-700 dark:group-hover:bg-teal-700/60'
                              : 'bg-indigo-600 dark:bg-indigo-800/50 text-white border border-indigo-700 dark:border-indigo-600/50 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-700/60'
                            : categoryIndex === 0
                              ? 'bg-blue-500 dark:bg-blue-800/30 text-white border border-blue-600 dark:border-blue-700/40 group-hover:bg-blue-600 dark:group-hover:bg-blue-700/40'
                              : categoryIndex === 1
                              ? 'bg-teal-500 dark:bg-teal-800/30 text-white border border-teal-600 dark:border-teal-700/40 group-hover:bg-teal-600 dark:group-hover:bg-teal-700/40'
                              : 'bg-indigo-500 dark:bg-indigo-800/30 text-white border border-indigo-600 dark:border-indigo-700/40 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-700/40'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
