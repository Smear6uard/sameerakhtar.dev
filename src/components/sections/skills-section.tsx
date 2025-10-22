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
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-slate-50 dark:bg-indigo-950/20",
    skills: [
      { name: "JavaScript", level: "Proficient", project: "3+ years experience" },
      { name: "Python", level: "Proficient", project: "3+ years experience" },
      { name: "Swift", level: "Intermediate", project: "2+ years experience" },
      { name: "Java", level: "Intermediate", project: "1+ years experience" },
      { name: "SQL", level: "Beginner", project: "1+ years experience" },
      { name: "PHP", level: "Beginner", project: "1+ years experience" },
    ]
  },
  {
    title: "Technologies & Tools",
    icon: ServerIcon,
    color: "from-emerald-500 to-cyan-600",
    bgColor: "bg-slate-50 dark:bg-emerald-950/20",
    skills: [
      { name: "AWS", level: "Proficient", project: "Cloud Development" },
      { name: "Langchain", level: "Proficient", project: "AI Integration" },
      { name: "Docker", level: "Proficient", project: "Containerization" },
      { name: "iOS Development", level: "Intermediate", project: "Mobile Apps" },
      { name: "Bootstrap", level: "Proficient", project: "UI Framework" },
      { name: "Git", level: "Expert", project: "Version Control" },
    ]
  },
  {
    title: "AI & Web Development",
    icon: WrenchScrewdriverIcon,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-slate-50 dark:bg-amber-950/20",
    skills: [
      { name: "Next.js", level: "Proficient", project: "AI Answer Engine" },
      { name: "React", level: "Proficient", project: "Web Applications" },
      { name: "Node.js", level: "Proficient", project: "Backend Development" },
      { name: "Groq SDK", level: "Proficient", project: "AI Integration" },
      { name: "Cheerio/Axios", level: "Proficient", project: "Web Scraping" },
      { name: "Puppeteer", level: "Proficient", project: "Dynamic Scraping" },
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
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical skills and the technologies
            I work with to build exceptional digital experiences.
          </p>
        </motion.div>

        {/* Skills by Category */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {skillCategories.map((category, categoryIndex) => (
       <motion.div
         key={categoryIndex}
         variants={itemVariants}
         className="modern-card p-8 interactive-hover"
         whileHover={{
           scale: 1.05,
           y: -10,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className={`flex items-center justify-between p-3 rounded-lg ${category.bgColor} hover:opacity-90 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 border border-border/50 transition-all duration-300 group`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          {skill.project}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {skill.level === 'Expert' && (
                          <StarIcon className="w-3.5 h-3.5 text-orange-500 fill-orange-500 dark:text-orange-400 dark:fill-orange-400 group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                          skill.level === 'Expert'
                            ? 'bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 group-hover:scale-105'
                            : 'bg-muted text-muted-foreground border border-border group-hover:bg-primary/5 group-hover:text-primary group-hover:scale-105'
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
