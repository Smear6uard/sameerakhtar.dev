"use client";

import { useToast } from "@/components/ui/Toast";

interface CopyEmailProps {
  email: string;
  className?: string;
  children: React.ReactNode;
}

export function CopyEmail({ email, className = "", children }: CopyEmailProps) {
  const { showToast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    // If cmd/ctrl is held, open email client instead
    if (e.metaKey || e.ctrlKey) {
      window.location.href = `mailto:${email}`;
      return;
    }

    e.preventDefault();

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied! Looking forward to hearing from you.", "success");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showToast("Email copied!", "success");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      title="Click to copy, Cmd/Ctrl+click to open email"
      aria-label="Email"
    >
      {children}
    </button>
  );
}
