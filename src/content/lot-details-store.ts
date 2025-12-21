import type { LotDetails } from "../types/common";

// Global store for lot details accessible from anywhere
let lotDetailsStore: LotDetails | null = null;
const listeners = new Set<(details: LotDetails | null) => void>();

export function setLotDetails(details: LotDetails | null) {
  lotDetailsStore = details;
  // Notify all listeners
  listeners.forEach((listener) => listener(details));
}

export function getLotDetails(): LotDetails | null {
  return lotDetailsStore;
}

export function subscribeLotDetails(
  listener: (details: LotDetails | null) => void,
) {
  listeners.add(listener);
  // Immediately call with current value
  listener(lotDetailsStore);

  return () => {
    listeners.delete(listener);
  };
}
