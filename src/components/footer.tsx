"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Sameer Akhtar
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
