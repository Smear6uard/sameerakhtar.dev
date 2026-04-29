"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectArchitectureVisual } from "@/components/ui/ProjectArchitectureVisual";

export function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

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
        {(hasError || isLoading) && (
          <ProjectArchitectureVisual src={src} title={alt} />
        )}
        {src && !hasError && !isLoading && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  );
}
