import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Mono section label that decodes from noise the first time it scrolls in. */
export function SectionTitle({ text, className = "" }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const run = () => {
      const scramble = 8;
      const decode = 16;
      let frame = 0;
      const id = window.setInterval(() => {
        const progress = (frame - scramble) / decode;
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (frame >= scramble && progress > i / text.length + 0.25) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );
        frame += 1;
        if (frame > scramble + decode + 4) {
          window.clearInterval(id);
          setDisplay(text);
        }
      }, 38);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={`section-title ${className}`}>
      {display}
    </span>
  );
}
