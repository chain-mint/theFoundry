export interface SimulationAnalyticsEvent {
  id: string;
  event: string;
  timestamp: string;
  payload?: Record<string, string | number | boolean | null | undefined>;
}

const ANALYTICS_KEY = "foundry.sim.analytics.events";
const isBrowser = () => typeof window !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export function getSimulationAnalyticsEvents(): SimulationAnalyticsEvent[] {
  if (!isBrowser()) return [];
  return safeParse<SimulationAnalyticsEvent[]>(
    window.localStorage.getItem(ANALYTICS_KEY),
    [],
  );
}

export function trackSimulationEvent(
  event: string,
  payload?: SimulationAnalyticsEvent["payload"],
): void {
  if (!isBrowser()) return;
  const events = getSimulationAnalyticsEvents();
  const next: SimulationAnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    event,
    timestamp: new Date().toISOString(),
    payload,
  };
  window.localStorage.setItem(
    ANALYTICS_KEY,
    JSON.stringify([next, ...events].slice(0, 300)),
  );
}
