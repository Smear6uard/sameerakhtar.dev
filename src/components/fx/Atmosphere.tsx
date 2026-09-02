// Fixed background: soft orange, blue, and violet orbs plus a film grain.
// Pure CSS so it costs nothing at runtime; dims under the light theme.

const ORBS = [
  { size: 520, x: "18%", y: "28%", color: "rgba(249,115,22,0.16)", blur: 110, delay: "0s" },
  { size: 380, x: "78%", y: "18%", color: "rgba(96,165,250,0.09)", blur: 100, delay: "-5s" },
  { size: 420, x: "70%", y: "72%", color: "rgba(249,115,22,0.08)", blur: 120, delay: "-9s" },
  { size: 360, x: "10%", y: "78%", color: "rgba(167,139,250,0.07)", blur: 110, delay: "-3s" },
];

export function Atmosphere() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: "var(--orb-opacity)" }}
      aria-hidden="true"
    >
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="orb absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animationDelay: orb.delay,
            willChange: "transform",
          }}
        />
      ))}
      <div
        className="absolute inset-0 hidden opacity-[0.03] md:block"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
