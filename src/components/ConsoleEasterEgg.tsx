"use client";

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Clear any previous messages
    console.clear();

    // ASCII art header - minimalist, not emoji-filled
    console.log(
      `%c
  ┌─────────────────────────────────────┐
  │  SAMEER AKHTAR                      │
  │  $0.002 per AI call                 │
  └─────────────────────────────────────┘
`,
      "color: #f97316; font-family: monospace; font-size: 10px;"
    );

    // The hook
    console.log(
      "%cYou found the console. Most people never look here.",
      "color: #f97316; font-size: 14px; font-weight: bold;"
    );

    console.log(
      "%cThat probably means you're curious about how things work.",
      "color: #94a3b8; font-size: 12px;"
    );

    // The technical flex
    console.log(
      "%c\nThe AI pipeline you saw on the homepage?",
      "color: #94a3b8; font-size: 12px;"
    );

    console.log(
      `%c
  Stage 1: AWS Rekognition ─────── $0.001
  Stage 2: BiRefNet ────────────── $0.003
  Stage 3: Florence-2 ──────────── $0.001
  Stage 4: FashionSigLIP (768d) ── $0.00002
  Stage 5: Gemini 2.5 Flash ────── $0.002
  Stage 6: pgvector ────────────── —
  ──────────────────────────────────────
  Total: $0.01/item
`,
      "color: #64748b; font-size: 11px; font-family: monospace;"
    );

    console.log(
      "%cThat's the actual breakdown. Took a while to get there.",
      "color: #94a3b8; font-size: 12px;"
    );

    // The invitation
    console.log(
      "%c\nIf you're hiring:",
      "color: #94a3b8; font-size: 12px;"
    );

    console.log(
      "%cSameer_Akhtar@icloud.com",
      "color: #f97316; font-size: 12px; font-weight: bold;"
    );

    console.log(
      "%c\nIf you're building:",
      "color: #94a3b8; font-size: 12px;"
    );

    console.log(
      "%chttps://github.com/Smear6uard",
      "color: #f97316; font-size: 12px;"
    );

    // The closer
    console.log(
      "%c\n// People who read console logs are my kind of people.",
      "color: #475569; font-size: 11px; font-style: italic;"
    );
  }, []);

  return null;
}
