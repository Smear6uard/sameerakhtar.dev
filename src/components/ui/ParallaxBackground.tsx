interface FloatingOrb {
  size: number;
  x: string;
  y: string;
  color: string;
  blur: number;
}

const orbs: FloatingOrb[] = [
  // Main accent orb (orange)
  {
    size: 400,
    x: "20%",
    y: "30%",
    color: "rgba(249, 115, 22, 0.15)",
    blur: 100,
  },
  // Secondary accent orb
  {
    size: 300,
    x: "70%",
    y: "60%",
    color: "rgba(249, 115, 22, 0.08)",
    blur: 120,
  },
  // Subtle blue accent
  {
    size: 250,
    x: "80%",
    y: "20%",
    color: "rgba(96, 165, 250, 0.06)",
    blur: 80,
  },
  // Deep purple hint
  {
    size: 350,
    x: "10%",
    y: "70%",
    color: "rgba(168, 85, 247, 0.05)",
    blur: 100,
  },
];

export function ParallaxBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {orbs.map((orb, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            transform: "translate(-50%, -50%) translateZ(0)",
          }}
        />
      ))}

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015] hidden md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
