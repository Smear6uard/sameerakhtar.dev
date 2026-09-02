import { useEffect, useState } from "react";

/** Live local time in Chicago. Renders the placeholder until hydrated. */
export function ChicagoTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Chicago",
    });
    const tick = () => setTime(format.format(new Date()).toLowerCase());
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time ? `chicago, ${time}` : "chicago"}
    </span>
  );
}
