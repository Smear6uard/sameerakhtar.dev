"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { GithubIcon, LinkedinIcon, X } from "lucide-react";

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: "Email",
    value: "Sameer_Akhtar@icloud.com",
    href: "mailto:Sameer_Akhtar@icloud.com"
  },
  {
    icon: MapPinIcon,
    title: "Location",
    value: "Greater Chicago Area",
    href: "#"
  }
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Smear6uard", icon: GithubIcon },
  { name: "LinkedIn", href: "https://linkedin.com/in/sameer-a-akhtar", icon: LinkedinIcon },
  { name: "X (Twitter)", href: "https://x.com/s_ameer_akhtar", icon: X },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "bd59d283-d4a0-4ec5-93bf-d2110eabf912",
          ...formData,
          from_name: formData.name,
          subject: `Portfolio Contact: ${formData.subject}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

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
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Ready to collaborate? Let&apos;s connect and discuss your next project.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={itemVariants} className="space-y-8 sm:space-y-12">
          {/* Contact Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 modern-card group interactive-hover"
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="p-2 sm:p-3 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <info.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base group-hover:text-primary transition-colors duration-300">{info.title}</h4>
                  <a
                    href={info.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-300 break-all"
                  >
                    {info.value}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="modern-card p-6 sm:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                placeholder="Project Inquiry"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500"
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Message sent successfully! I&apos;ll get back to you soon.</span>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
              >
                <ExclamationCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{errorMessage || "Failed to send message. Please try again."}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: status === "loading" ? 1 : 1.05 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.95 }}
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Social Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 sm:mb-6 text-base sm:text-lg">Follow Me</h4>
            <div className="flex justify-center gap-3 sm:gap-4">
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
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
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
