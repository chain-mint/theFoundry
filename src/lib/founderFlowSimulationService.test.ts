import { beforeEach, describe, expect, it } from "vitest";
import {
  leanEfficiencyRoles,
  maxGrowthRoles,
  type BlueprintRole,
} from "@/data/mockData";
import {
  buildPendingResponsesForLockedTeam,
  finalizeFounderFlowProject,
  getBlueprintRolesForStrategy,
  getSeededFounderFlowScenarios,
  replaceTalentForRole,
  simulateTalentResponseStates,
  simulateTeamArchitectureGeneration,
  syncSigningStatusToBoard,
} from "@/lib/founderFlowSimulationService";
import { getFinalizedFounderProjects } from "@/lib/idiceBoardStore";
import { getSimulationAnalyticsEvents } from "@/lib/simulationAnalytics";

describe("founderFlowSimulationService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns cloned blueprint roles per strategy", () => {
    const growthRoles = getBlueprintRolesForStrategy("growth_team");
    expect(growthRoles.length).toBe(maxGrowthRoles.length);
    expect(growthRoles).not.toBe(maxGrowthRoles);

    growthRoles[0].title = "Changed Title";
    expect(maxGrowthRoles[0].title).not.toBe("Changed Title");
  });

  it("replaces role talent via service contract", () => {
    const initial = getBlueprintRolesForStrategy("lean_team");
    const updated = replaceTalentForRole({
      teamRoles: initial,
      roleId: initial[0].id,
      candidate: {
        name: "Replacement Talent",
        avatar: "RT",
        matchScore: 88,
        cohort: "Cohort X",
      },
    });

    expect(updated[0].matchedTalent?.name).toBe("Replacement Talent");
  });

  it("simulates deterministic response states", () => {
    const withUnassigned: BlueprintRole[] = [
      ...leanEfficiencyRoles,
      {
        id: "custom-unassigned",
        title: "Unassigned Role",
        skills: ["React"],
        equityAsk: "5%",
        matchedTalent: null,
      },
    ];

    const first = simulateTalentResponseStates(withUnassigned);
    const second = simulateTalentResponseStates(withUnassigned);

    expect(first.responses).toEqual(second.responses);
    expect(first.responses["custom-unassigned"]).toBe("pending");
  });

  it("builds pending responses for locked team", () => {
    const existing = { [leanEfficiencyRoles[0].id]: "accepted" as const };
    const result = buildPendingResponsesForLockedTeam(
      leanEfficiencyRoles,
      existing,
    );

    expect(result[leanEfficiencyRoles[0].id]).toBe("accepted");
    expect(result[leanEfficiencyRoles[1].id]).toBe("pending");
  });

  it("supports generation, finalization, and signing sync end-to-end", async () => {
    await simulateTeamArchitectureGeneration({
      problem: "Founders lack fast vetted hiring paths.",
      solution: "Automated team architecture and talent assignment.",
      industry: "FinTech",
      stage: "mvp",
    });

    const { projectId } = finalizeFounderFlowProject({
      founderName: "Abasi Founder",
      projectName: "FinTech MVP PROJECT",
      industry: "FinTech",
      stage: "mvp",
      strategy: "lean_team",
      finalizedAt: "2026-03-19T12:00:00.000Z",
      teamRoles: leanEfficiencyRoles,
    });

    syncSigningStatusToBoard(projectId, "in_progress");

    const projects = getFinalizedFounderProjects();
    expect(projects[0].id).toBe(projectId);
    expect(projects[0].signingStatus).toBe("in_progress");

    const analyticsEvents = getSimulationAnalyticsEvents().map(
      (event) => event.event,
    );
    expect(analyticsEvents).toContain("architecture_generated");
    expect(analyticsEvents).toContain("founder_flow_finalized");
    expect(analyticsEvents).toContain("project_signing_status_updated");
  });

  it("provides seeded founder scenarios", () => {
    const seeds = getSeededFounderFlowScenarios();
    expect(seeds.length).toBeGreaterThan(0);
    expect(seeds.some((seed) => seed.id === "seed-fintech-mvp")).toBe(true);
  });
});
