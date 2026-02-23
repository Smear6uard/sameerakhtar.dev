"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if image exists
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [src]);

  return (
    <div className="max-w-5xl mx-auto px-6 mb-12">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-gradient-to-br from-accent/10 to-purple-500/10">
        {!hasError && !isLoading && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Fallback content shown if image fails or is loading */}
        {(hasError || isLoading) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-text-muted/30 text-sm font-mono">
              {""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
