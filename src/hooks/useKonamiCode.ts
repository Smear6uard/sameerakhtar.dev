"use client";

import { useEffect, useState, useCallback } from "react";

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useKonamiCode(onActivate: () => void) {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isActivated) return;

      const newSequence = [...inputSequence, event.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      // Check if the sequence matches
      if (newSequence.length === KONAMI_CODE.length) {
        const isMatch = newSequence.every(
          (key, index) => key === KONAMI_CODE[index]
        );

        if (isMatch) {
          setIsActivated(true);
          onActivate();
        }
      }
    },
    [inputSequence, isActivated, onActivate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setInputSequence([]);
    setIsActivated(false);
  }, []);

  return { isActivated, reset };
}
