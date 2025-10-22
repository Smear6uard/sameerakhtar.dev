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
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Resume & <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
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
            <ArrowDownTrayIcon className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
            <span>Download PDF Resume</span>
          </motion.a>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
          {/* Left Column - Professional Experience */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Professional Experience</h3>
            </div>
            
            <div className="h-[32rem] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
              {experience.map((job, index) => (
       <motion.div
         key={index}
         variants={itemVariants}
         className="modern-card p-6 group cursor-pointer"
         whileHover={{
           y: -10,
           scale: 1.03,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-1">{job.title}</h4>
                    <p className="text-primary font-medium mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-foreground/80 dark:text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{job.period}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-foreground/80 dark:text-muted-foreground mb-4 text-sm leading-relaxed">{job.description}</p>

                  <div>
                    <h5 className="font-semibold mb-2 text-sm">Key Achievements:</h5>
                    <ul className="space-y-1.5">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start gap-2 hover:translate-x-3 hover:scale-105 transition-all duration-300 ease-out group">
                          <span className="text-primary mt-1 text-xs group-hover:scale-125 transition-transform duration-300">•</span>
                          <span className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed group-hover:text-primary transition-colors duration-300">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Education & Certifications */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Education */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <AcademicCapIcon className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Education</h3>
              </div>
              
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="modern-card p-6 cursor-pointer group"
                    whileHover={{ 
                      y: -10,
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-300">{edu.degree}</h4>
                    <p className="text-primary font-medium mb-3 group-hover:scale-105 transition-transform duration-300">{edu.school}</p>
                    <div className="flex flex-col gap-1.5 text-sm text-foreground/80 dark:text-muted-foreground">
                      <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                        <MapPinIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>{edu.location}</span>
                      </div>
                      <div className="flex items-center gap-1 group-hover:text-primary transition-colors duration-300">
                        <CalendarIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>{edu.period}</span>
                      </div>
                      <span className="text-primary font-medium group-hover:scale-105 transition-transform duration-300">GPA: {edu.gpa}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <TrophyIcon className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Certifications</h3>
              </div>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="modern-card p-6 text-center cursor-pointer group"
                    whileHover={{ 
                      y: -10,
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <h4 className="font-bold mb-1 group-hover:text-primary transition-colors duration-300">{cert.name}</h4>
                    <p className="text-primary font-medium mb-1 group-hover:scale-105 transition-transform duration-300">{cert.issuer}</p>
                    <p className="text-sm text-foreground/80 dark:text-muted-foreground group-hover:text-primary transition-colors duration-300">{cert.date}</p>
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
