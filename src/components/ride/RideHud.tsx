import { useSyncExternalStore } from "react";
import { LAST_STOP, STOPS } from "@/ride/route";
import { rideStore } from "@/ride/store";

/** The route as a transit strip: one station per stop, the car between them. */
export function RideHud() {
  const active = useSyncExternalStore(rideStore.subscribe, rideStore.get, () => 0);

  return (
    <nav className="route" aria-label="Route">
      <p className="route-label">
        <span className="route-count">
          {active + 1}/{STOPS.length}
        </span>
        {STOPS[active].label}
      </p>
      <div className="route-track">
        <span className="route-fill" />
        <ol>
          {STOPS.map((stop, i) => (
            <li key={stop.id} style={{ left: `${(i / LAST_STOP) * 100}%` }}>
              <a
                href={`#${stop.id}`}
                className="route-station"
                data-state={i === active ? "active" : i < active ? "passed" : "ahead"}
                aria-current={i === active ? "step" : undefined}
                title={stop.label}
              >
                <span className="sr-only">{stop.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <span className="route-car" />
      </div>
    </nav>
  );
}
