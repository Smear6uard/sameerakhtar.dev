"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  ArrowDownTrayIcon, 
  CalendarIcon, 
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon
} from "@heroicons/react/24/outline";

const experience = [
  {
    title: "Specialist",
    company: "Apple",
    location: "Naperville, IL",
    period: "Jul 2025 - Present",
    description: "Delivering tailored hardware/software solutions to optimize workflows for individual and business clients.",
    achievements: [
      "Configured devices, migrated data, and resolved technical issues for seamless client adoption",
      "Translated complex technical concepts into clear language, boosting customer engagement and retention",
      "Optimized workflows for individual and business clients through tailored solutions"
    ]
  },
  {
    title: "Co-Founder & Vice President",
    company: "Computer Science Club",
    location: "Lisle, IL",
    period: "Sep 2023 - Aug 2024",
    description: "Led organizational efforts and strategic initiatives for the Computer Science Club at DePaul University.",
    achievements: [
      "Organized 10+ events and workshops, increasing student participation by 60%",
      "Spearheaded outreach campaigns that doubled membership and raised the club's profile across campus",
      "Built partnerships with faculty and peers to expand technical and networking opportunities"
    ]
  },
  {
    title: "Systems Integration Specialist",
    company: "American Coach Limousine",
    location: "Downers Grove, IL",
    period: "Jul 2022 - Feb 2024",
    description: "Streamlined coordination across teams and implemented software tools to improve operational efficiency.",
    achievements: [
      "Streamlined coordination across teams, improving delivery alignment for 15+ corporate clients",
      "Implemented software tools that reduced nationwide partner response times by 30%",
      "Enhanced operational workflows by aligning technical solutions with business needs"
    ]
  }
];

const education = [
  {
    degree: "Bachelors of Science in Computer Science",
    school: "DePaul University",
    location: "Chicago, IL", 
    period: "Expected Graduation: July 2027",
    gpa: "3.8 GPA"
  }
];

const certifications = [
  {
    name: "Scrimba Fullstack/AI Developer Course Certificate",
    issuer: "Scrimba",
    date: "May 2025 - July 2025"
  }
];

export function ResumeSection() {
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
            Resume & <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            Professional experience, education, and achievements in software development.
          </p>

          {/* Download Button */}
          <motion.a
            href="/Sameer-Akhtar-Resume.pdf"
            download
            className="btn-primary inline-flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
            <span className="text-sm sm:text-base">Download PDF Resume</span>
          </motion.a>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-9">
          {/* Left Column - Professional Experience */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg">
                <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Professional Experience</h3>
            </div>
            
            <div className="h-[24rem] sm:h-[32rem] overflow-y-auto pr-2 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
              {experience.map((job, index) => (
       <motion.div
         key={index}
         variants={itemVariants}
         className="relative group cursor-pointer"
         whileHover={{
           y: -10,
           scale: 1.03,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-500/10 to-indigo-500/15' :
                    index === 1 ? 'from-indigo-500/10 to-blue-600/15' :
                    'from-blue-600/10 to-indigo-600/15'
                  } rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                  
                  {/* Card Content */}
                  <div className="relative modern-card p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                      <h4 className="text-base sm:text-lg font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{job.title}</h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-2 text-sm sm:text-base group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">{job.company}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground">
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>{job.period}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-foreground/80 dark:text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{job.description}</p>

                    <div>
                      <h5 className="font-semibold mb-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400">Key Achievements:</h5>
                      <ul className="space-y-1 sm:space-y-1.5">
                        {job.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="flex items-start gap-2 hover:translate-x-3 hover:scale-105 transition-all duration-300 ease-out group/achievement">
                            <span className="text-blue-500 dark:text-blue-400 mt-1 text-xs group-hover/achievement:scale-125 transition-transform duration-300">•</span>
                            <span className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed group-hover/achievement:text-blue-600 dark:group-hover/achievement:text-blue-400 transition-colors duration-300">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Education & Certifications */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Education */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg shadow-lg">
                  <AcademicCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Education</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative group cursor-pointer"
                    whileHover={{ 
                      y: -10,
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/15 rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative modern-card p-4 sm:p-6">
                      <h4 className="text-base sm:text-lg font-bold mb-1 group-hover:text-teal-600 transition-colors duration-300">{edu.degree}</h4>
                      <p className="text-teal-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base group-hover:text-teal-700 transition-colors duration-300">{edu.school}</p>
                      <div className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground">
                        <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600 group-hover:scale-110 transition-transform duration-300" />
                          <span>{edu.location}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />
                          <span>{edu.period}</span>
                        </div>
                        <span className="text-teal-600 font-medium text-xs sm:text-sm group-hover:scale-105 transition-transform duration-300">GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
                  <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Certifications</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative group cursor-pointer"
                    whileHover={{ 
                      y: -10,
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/15 rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative modern-card p-4 sm:p-6 text-center">
                      <h4 className="font-bold mb-1 text-sm sm:text-base group-hover:text-indigo-600 transition-colors duration-300">{cert.name}</h4>
                      <p className="text-indigo-600 font-medium mb-1 text-xs sm:text-sm group-hover:text-indigo-700 transition-colors duration-300">{cert.issuer}</p>
                      <p className="text-xs sm:text-sm text-foreground/80 dark:text-muted-foreground group-hover:text-indigo-600 transition-colors duration-300">{cert.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
