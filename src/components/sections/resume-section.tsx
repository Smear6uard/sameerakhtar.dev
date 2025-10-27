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
    title: "Software Engineering Intern",
    company: "BRUNOSOFT",
    location: "Remote",
    period: "Oct 2025 - Present",
    description: "Leading migration of legacy AngularJS codebase to modern Angular, modernizing architecture for 100+ components.",
    achievements: [
      "Leading migration of legacy AngularJS codebase to modern Angular, modernizing architecture for 100+ components",
      "Implementing containerized workflows using Docker and docker-compose to streamline deployment processes",
      "Orchestrating deployments using Kubernetes pods, services, and deployments for scalable infrastructure",
      "Developing custom plugins and themes for client CMS platforms using hooks, actions, and templates"
    ]
  },
  {
    title: "Specialist",
    company: "Apple",
    location: "Naperville, IL",
    period: "Jul 2025 - Present",
    description: "Supported 50+ individual and business clients monthly with device setup, troubleshooting, and technical guidance.",
    achievements: [
      "Supported 50+ individual and business clients monthly with device setup, troubleshooting, and technical guidance",
      "Configured iOS and macOS devices for enterprise environments, including MDM enrollment and system integration",
      "Maintained 95%+ satisfaction rating through clear communication of technical solutions and product recommendations"
    ]
  },
  {
    title: "Systems Integration Specialist",
    company: "American Coach Limousine",
    location: "Downers Grove, IL",
    period: "Jul 2022 - Feb 2024",
    description: "Streamlined coordination across teams, improving delivery alignment for 15+ corporate clients.",
    achievements: [
      "Streamlined coordination across teams, improving delivery alignment for 15+ corporate clients",
      "Implemented software tools that reduced nationwide partner response times by 30%",
      "Enhanced operational workflows by aligning technical solutions with business needs"
    ]
  }
];

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "DePaul University",
    location: "Chicago, IL", 
    period: "Expected Graduation: Jul 2027",
    gpa: "3.8 GPA"
  }
];

const certifications = [
  {
    name: "Scrimba Fullstack/AI Developer Course Certificate",
    issuer: "Scrimba",
    date: "May 2025 - Jul 2025",
    description: "200+ hours in React, Next.js, Node.js, and AI Integration"
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
    <div ref={ref} className="section-spacing bg-background">
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
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Professional Experience */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <BriefcaseIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Professional Experience</h3>
            </div>

            <div className="h-[28rem] sm:h-[36rem] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-track-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-600/70 [&::-webkit-scrollbar-thumb]:rounded-full">
              {experience.map((job, index) => (
       <motion.div
         key={index}
         variants={itemVariants}
         className="relative group cursor-pointer"
         whileHover={{
           y: -4,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-500/8 to-indigo-500/12' :
                    index === 1 ? 'from-indigo-500/8 to-blue-600/12' :
                    'from-blue-600/8 to-indigo-600/12'
                  } rounded-2xl opacity-50 group-hover:opacity-80 transition-all duration-300`} />

                  {/* Card Content */}
                  <div className="relative modern-card p-5 sm:p-6 border border-gray-200/80">
                    <div className="mb-3">
                      <h4 className="text-base sm:text-lg font-bold mb-1.5 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{job.title}</h4>
                      <p className="text-blue-600 font-semibold mb-2.5 text-sm sm:text-base group-hover:text-blue-700 transition-colors duration-300">{job.company}</p>
                      <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-200">
                          <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                          <span className="text-gray-700 font-medium">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-200">
                          <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                          <span className="text-gray-700 font-medium">{job.period}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 text-xs sm:text-sm leading-relaxed">{job.description}</p>

                    <div>
                      <h5 className="font-semibold mb-2 text-xs sm:text-sm text-blue-600">Key Achievements:</h5>
                      <ul className="space-y-1.5">
                        {job.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex} className="flex items-start gap-2 hover:translate-x-1 transition-all duration-300 ease-out group/achievement">
                            <span className="text-blue-500 mt-0.5 text-xs font-bold group-hover/achievement:text-blue-700 transition-colors duration-300">•</span>
                            <span className="text-xs text-gray-600 leading-relaxed group-hover/achievement:text-gray-800 transition-colors duration-300">{achievement}</span>
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
            <div className="pr-2 space-y-6">
              {/* Education */}
              <div>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg">
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
                      y: -4,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/8 to-cyan-500/12 rounded-2xl opacity-50 group-hover:opacity-80 transition-all duration-300" />

                    {/* Card Content */}
                    <div className="relative modern-card p-5 sm:p-6 border border-gray-200/80">
                      <h4 className="text-base sm:text-lg font-bold mb-1.5 text-gray-900 group-hover:text-teal-600 transition-colors duration-300">{edu.degree}</h4>
                      <p className="text-teal-600 font-semibold mb-2.5 text-sm sm:text-base group-hover:text-teal-700 transition-colors duration-300">{edu.school}</p>
                      <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-lg border border-teal-200">
                          <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                          <span className="text-teal-700 font-medium">{edu.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 rounded-lg border border-cyan-200">
                          <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-600" />
                          <span className="text-cyan-700 font-medium">{edu.period}</span>
                        </div>
                        <div className="mt-1 px-2.5 py-1.5 bg-teal-100 rounded-lg border border-teal-300">
                          <span className="text-teal-700 font-bold text-xs sm:text-sm">{edu.gpa}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
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
                      y: -4,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-purple-500/12 rounded-2xl opacity-50 group-hover:opacity-80 transition-all duration-300" />

                    {/* Card Content */}
                    <div className="relative modern-card p-5 sm:p-6 border border-gray-200/80">
                      <h4 className="font-bold mb-1.5 text-sm sm:text-base text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{cert.name}</h4>
                      <p className="text-indigo-600 font-semibold mb-1.5 text-xs sm:text-sm group-hover:text-indigo-700 transition-colors duration-300">{cert.issuer}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-lg border border-indigo-200 mb-2.5">
                        <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                        <p className="text-xs sm:text-sm text-indigo-700 font-medium">{cert.date}</p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{cert.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
