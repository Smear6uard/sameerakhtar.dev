import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/components/ui/Link";
import type { Highlight } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface StopProps {
  id: string;
  /** Which side of the frame the copy sits on; the 3D subject takes the other. */
  side?: "left" | "right";
  /** The last stop has no drive after it. */
  last?: boolean;
  className?: string;
  children: ReactNode;
}

/** One stop on the ride: a normal section the scene holds still for. */
export function Stop({ id, side = "left", last = false, className, children }: StopProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
      el.dataset.in = "1";
      return;
    }
    el.dataset.in = "0";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "1";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -22% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={ref} id={id} data-stop className={cn("stop", `stop-${side}`, className)}>
        <div className="wrap">
          <div className="stop-col">{children}</div>
        </div>
      </section>
      {!last && <div className="transit" aria-hidden="true" />}
    </>
  );
}

/** Cover type: the stop's name, set like a magazine cover line. */
export function Cover({ as: Tag = "h2", children }: { as?: "h1" | "h2"; children: ReactNode }) {
  return <Tag className="cover">{children}</Tag>;
}

/** The dark panel that carries a stop's facts over the scene. */
export function Ticket({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ticket", className)}>{children}</div>;
}

export function TicketRule() {
  return <hr className="ticket-rule" />;
}

/** Measured results, three across. */
export function Figures({ items }: { items: Highlight[] }) {
  return (
    <dl className="figures">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.value}</dt>
          <dd>{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One line connecting what is on screen to what the copy says. */
export function SceneNote({ children }: { children: ReactNode }) {
  return <p className="scene-note">{children}</p>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href}
      className="link text-[0.9375rem]"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}
