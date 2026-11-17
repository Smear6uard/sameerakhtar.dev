// Which stop the ride is at. A tiny external store so the route strip can
// re-render on stop changes without the scroll handler touching React.

let active = 0;
const listeners = new Set<() => void>();

export const rideStore = {
  get: () => active,
  set(next: number) {
    if (next === active) return;
    active = next;
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
