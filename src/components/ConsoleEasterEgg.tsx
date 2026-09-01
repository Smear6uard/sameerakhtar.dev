import { useEffect } from "react";
import { site } from "@/lib/site";

export function ConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const heading = "color:#f2593f;font-weight:600;font-size:13px";
    const body = "color:#b3ada2;font-size:12px";
    const mono = "color:#7c776f;font-family:monospace;font-size:11px";

    console.log("%cYou found the console.", heading);
    console.log(
      "%cThe hand tracking on the homepage is MediaPipe Hand Landmarker running on WebAssembly + WebGL in this tab. No frames leave your browser.",
      body,
    );
    console.log(
      `%c\nquantum metric   AI Brand Discovery · Go · Gemini · Cloud Run\nrenaro           dispatch SaaS · 4,543 conns held in a 10K reconnect storm\nstyleum          iOS wardrobe app · 100+ users · $0.002/outfit\nhazardlens       YOLO26 site-safety pipeline · 15+ FPS\n`,
      mono,
    );
    console.log(`%cHiring for 2027? ${site.email}`, heading);
    console.log(`%c${site.sourceRepo}`, body);
  }, []);

  return null;
}
