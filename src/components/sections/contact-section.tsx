"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from "@heroicons/react/24/outline";
import { GithubIcon, LinkedinIcon, X } from "lucide-react";

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: "Email",
    value: "sameer_akhtar@icloud.com",
    href: "mailto:sameer_akhtar@icloud.com"
  },
  {
    icon: PhoneIcon,
    title: "Phone",
    value: "630-998-6261",
    href: "tel:6309986261"
  },
  {
    icon: MapPinIcon,
    title: "Location",
    value: "Chicago",
    href: "#"
  }
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Smear6uard", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/sameerakhtar", icon: LinkedinIcon },
  { name: "X (Twitter)", href: "https://twitter.com/sameerakhtar", icon: X },
];

export function ContactSection() {
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
          className="max-w-4xl mx-auto"
        >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to collaborate? Let&apos;s connect and discuss your next project.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="space-y-12">
          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
       <motion.div
         key={index}
         variants={itemVariants}
         className="flex items-center gap-4 p-6 modern-card group interactive-hover"
         whileHover={{ 
           scale: 1.05, 
           y: -8,
           transition: { duration: 0.3, ease: "easeOut" }
         }}
       >
         <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
           <info.icon className="w-5 h-5" />
         </div>
         <div>
           <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{info.title}</h4>
           <a
             href={info.href}
             className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
           >
             {info.value}
           </a>
         </div>
       </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-6 text-lg">Follow Me</h4>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
