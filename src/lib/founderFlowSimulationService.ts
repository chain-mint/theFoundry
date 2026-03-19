import {
  leanEfficiencyRoles,
  maxGrowthRoles,
  type BlueprintRole,
} from "@/data/mockData";
import {
  registerFounderFinalization,
  updateFounderProjectSigningStatus,
  type FounderStage,
  type FounderStrategy,
} from "@/lib/idiceBoardStore";
import { trackSimulationEvent } from "@/lib/simulationAnalytics";

export interface GenerationInput {
  problem: string;
  solution: string;
  industry: string;
  stage: FounderStage;
}

export interface FinalizationInput {
  founderName: string;
  projectName: string;
  industry: string;
  stage: FounderStage;
  strategy: FounderStrategy;
  finalizedAt: string;
  teamRoles: BlueprintRole[];
}

export interface SeededFounderFlowScenario {
  id: string;
  label: string;
  problem: string;
  solution: string;
  industry: string;
  stage: FounderStage;
  strategy: FounderStrategy;
}

export type SimulatedRoleResponse = "pending" | "accepted" | "rejected";

export interface ReplaceTalentInput {
  teamRoles: BlueprintRole[];
  roleId: string;
  candidate: {
    name: string;
    avatar: string;
    matchScore: number;
    cohort: string;
  };
}

const cloneRoles = (roles: BlueprintRole[]): BlueprintRole[] =>
  roles.map((role) => ({
    ...role,
    skills: [...role.skills],
    matchedTalent: role.matchedTalent ? { ...role.matchedTalent } : null,
  }));

export async function simulateTeamArchitectureGeneration(
  input: GenerationInput,
): Promise<{ ok: true; generatedAt: string }> {
  // Keep deterministic mock behavior while validating payload shape.
  if (
    !input.problem.trim() ||
    !input.solution.trim() ||
    !input.industry.trim()
  ) {
    trackSimulationEvent("architecture_generation_failed", {
      reason: "missing_input",
      stage: input.stage,
      industry: input.industry,
    });
    throw new Error("Missing required generation input.");
  }
  await new Promise((resolve) => setTimeout(resolve, 700));
  const generatedAt = new Date().toISOString();
  trackSimulationEvent("architecture_generated", {
    stage: input.stage,
    industry: input.industry,
  });
  return { ok: true, generatedAt };
}

export function getBlueprintRolesForStrategy(
  strategy: FounderStrategy,
): BlueprintRole[] {
  return strategy === "growth_team"
    ? cloneRoles(maxGrowthRoles)
    : cloneRoles(leanEfficiencyRoles);
}

export function replaceTalentForRole(
  input: ReplaceTalentInput,
): BlueprintRole[] {
  return input.teamRoles.map((role) => {
    if (role.id !== input.roleId) return role;
    return {
      ...role,
      matchedTalent: {
        name: input.candidate.name,
        avatar: input.candidate.avatar,
        matchScore: input.candidate.matchScore,
        cohort: input.candidate.cohort,
      },
    };
  });
}

const stableHash = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export function simulateTalentResponseStates(teamRoles: BlueprintRole[]): {
  responses: Record<string, SimulatedRoleResponse>;
  rejectedPairs: string[];
} {
  const responses: Record<string, SimulatedRoleResponse> = {};
  const rejectedPairs: string[] = [];

  teamRoles.forEach((role) => {
    if (!role.matchedTalent) {
      responses[role.id] = "pending";
      return;
    }

    // Deterministic distribution: approximately 25% rejected.
    const seed = stableHash(`${role.id}:${role.matchedTalent.name}`);
    const response: SimulatedRoleResponse =
      seed % 4 === 0 ? "rejected" : "accepted";
    responses[role.id] = response;

    if (response === "rejected") {
      rejectedPairs.push(`${role.id}:${role.matchedTalent.name}`);
    }
  });

  return { responses, rejectedPairs };
}

export function buildPendingResponsesForLockedTeam(
  teamRoles: BlueprintRole[],
  existing: Record<string, SimulatedRoleResponse>,
): Record<string, SimulatedRoleResponse> {
  const next = { ...existing };
  teamRoles.forEach((role) => {
    if (!next[role.id]) {
      next[role.id] = "pending";
    }
  });
  return next;
}

export function finalizeFounderFlowProject(input: FinalizationInput): {
  projectId: string;
} {
  const project = registerFounderFinalization({
    founderName: input.founderName,
    projectName: input.projectName,
    industry: input.industry,
    stage: input.stage,
    strategy: input.strategy,
    finalizedAt: input.finalizedAt,
    teamRoles: input.teamRoles,
  });
  trackSimulationEvent("founder_flow_finalized", {
    projectId: project.id,
    founderName: input.founderName,
    stage: input.stage,
    strategy: input.strategy,
  });
  return { projectId: project.id };
}

export function syncSigningStatusToBoard(
  projectId: string,
  status: "pending" | "in_progress" | "completed",
): void {
  updateFounderProjectSigningStatus(projectId, status);
  trackSimulationEvent("project_signing_status_updated", {
    projectId,
    signingStatus: status,
  });
}

export function getSeededFounderFlowScenarios(): SeededFounderFlowScenario[] {
  return [
    {
      id: "seed-fintech-mvp",
      label: "FinTech MVP - Lean",
      problem:
        "SMEs struggle with fragmented payments and delayed settlement timelines.",
      solution:
        "A unified payment orchestration layer that routes collections and automates reconciliation.",
      industry: "FinTech",
      stage: "mvp",
      strategy: "lean_team",
    },
    {
      id: "seed-agritech-prototype",
      label: "AgriTech Prototype - Lean",
      problem:
        "Smallholder farmers lack transparent channels to access premium off-takers.",
      solution:
        "A mobile marketplace with produce verification and logistics scheduling for verified buyers.",
      industry: "AgriTech",
      stage: "prototype",
      strategy: "lean_team",
    },
    {
      id: "seed-healthtech-growth",
      label: "HealthTech Growth - Growth",
      problem:
        "Rural clinics have inconsistent access to patient records and care follow-up coordination.",
      solution:
        "A care coordination platform with remote triage, patient records, and referral workflows.",
      industry: "HealthTech",
      stage: "growth",
      strategy: "growth_team",
    },
  ];
}
