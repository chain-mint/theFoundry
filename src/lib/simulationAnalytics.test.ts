import { beforeEach, describe, expect, it } from "vitest";
import {
  getSimulationAnalyticsEvents,
  trackSimulationEvent,
} from "@/lib/simulationAnalytics";

describe("simulationAnalytics", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores newest analytics event first", () => {
    trackSimulationEvent("first_event", { ok: true });
    trackSimulationEvent("second_event", { count: 2 });

    const events = getSimulationAnalyticsEvents();
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe("second_event");
    expect(events[1].event).toBe("first_event");
  });

  it("caps analytics storage to 300 events", () => {
    for (let i = 0; i < 305; i += 1) {
      trackSimulationEvent("bulk_event", { idx: i });
    }

    const events = getSimulationAnalyticsEvents();
    expect(events).toHaveLength(300);
  });
});
