import { describe, expect, it } from "vitest";
import {
  canAccessPath,
  getAllowedMenuKeys,
  getImpactPageIntent,
  getMatchesPageIntent,
  getRoleNavigation,
  getTeamPageIntent,
} from "@/lib/roleNavigation";

describe("roleNavigation", () => {
  it("applies persona-specific sidebar labels", () => {
    const talentNav = getRoleNavigation("talent");
    const founderNav = getRoleNavigation("founder");
    const boiNav = getRoleNavigation("boi-officer");
    const adminNav = getRoleNavigation("admin");

    expect(
      talentNav.some((item) => item.title === "Assigned Team Context"),
    ).toBe(true);
    expect(talentNav.some((item) => item.title === "My Impact & Equity")).toBe(
      true,
    );
    expect(founderNav.some((item) => item.title === "Talent Matching")).toBe(
      true,
    );
    expect(
      founderNav.some((item) => item.title === "Milestone & Grant Readiness"),
    ).toBe(true);
    expect(boiNav.some((item) => item.title === "Portfolio Oversight")).toBe(
      true,
    );
    expect(adminNav.some((item) => item.title === "Program Ops")).toBe(true);
    expect(adminNav.some((item) => item.title === "Placement Pipeline")).toBe(
      true,
    );
  });

  it("enforces role-based route access", () => {
    expect(canAccessPath("founder", "/notifications")).toBe(false);
    expect(canAccessPath("talent", "/notifications")).toBe(true);
    expect(canAccessPath("boi-officer", "/matches")).toBe(true);
    expect(canAccessPath("admin", "/impact")).toBe(true);
    expect(canAccessPath("admin", "/notifications/")).toBe(false);
    expect(canAccessPath("founder", "/matches/")).toBe(true);
  });

  it("keeps page intents aligned with sidebar vocabulary", () => {
    expect(getTeamPageIntent("boi-officer").title).toBe("Portfolio Oversight");
    expect(getMatchesPageIntent("admin").title).toBe("Placement Pipeline");
    expect(getImpactPageIntent("founder").title).toBe(
      "Milestone & Grant Readiness",
    );
  });

  it("matches the role menu visibility matrix", () => {
    expect(getAllowedMenuKeys("talent")).toEqual([
      "dashboard",
      "matches",
      "team",
      "notifications",
      "impact",
      "settings",
    ]);
    expect(getAllowedMenuKeys("founder")).toEqual([
      "dashboard",
      "team",
      "matches",
      "impact",
      "settings",
    ]);
    expect(getAllowedMenuKeys("boi-officer")).toEqual([
      "dashboard",
      "team",
      "matches",
      "impact",
      "settings",
    ]);
    expect(getAllowedMenuKeys("admin")).toEqual([
      "dashboard",
      "team",
      "matches",
      "impact",
      "settings",
    ]);
  });
});
