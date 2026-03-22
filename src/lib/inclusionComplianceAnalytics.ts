import type { BoiStatePlacement } from "@/data/mockData";

export type InclusionStatus = "on_track" | "watch" | "off_track";

export interface InclusionTargetConfig {
  femaleLedShareTargetPct: number;
  youthEmploymentThresholdPct: number;
}

export interface InclusionSnapshot {
  femaleLedSharePct: number;
  youthEmploymentSharePct: number;
  femaleLedVariancePct: number;
  youthEmploymentVariancePct: number;
  femaleLedStatus: InclusionStatus;
  youthEmploymentStatus: InclusionStatus;
}

export interface InclusionAlert {
  metric: "female_led_share" | "youth_employment_threshold";
  scopeType: "national" | "state";
  scopeId: string;
  severity: "low" | "medium" | "high";
  reason: string;
  currentValue: number;
  targetValue: number;
  variancePct: number;
}

export interface InclusionComplianceInsights {
  targetConfig: InclusionTargetConfig;
  nationalSnapshot: InclusionSnapshot;
  stateSnapshots: Array<{
    state: string;
    snapshot: InclusionSnapshot;
  }>;
  alerts: InclusionAlert[];
}

const DEFAULT_TARGETS: InclusionTargetConfig = {
  femaleLedShareTargetPct: 50,
  youthEmploymentThresholdPct: 10,
};

function classify(actual: number, target: number): InclusionStatus {
  if (actual >= target) return "on_track";
  if (actual >= target - 5) return "watch";
  return "off_track";
}

function severityFromVariance(variance: number): InclusionAlert["severity"] {
  if (variance <= -10) return "high";
  if (variance <= -5) return "medium";
  return "low";
}

function buildSnapshot(
  femaleLedStartups: number,
  totalStartups: number,
  youthEmployees: number,
  totalEmployees: number,
  targets: InclusionTargetConfig,
): InclusionSnapshot {
  const femaleLedSharePct =
    totalStartups === 0
      ? 0
      : Number(((femaleLedStartups / totalStartups) * 100).toFixed(1));
  const youthEmploymentSharePct =
    totalEmployees === 0
      ? 0
      : Number(((youthEmployees / totalEmployees) * 100).toFixed(1));

  const femaleLedVariancePct = Number(
    (femaleLedSharePct - targets.femaleLedShareTargetPct).toFixed(1),
  );
  const youthEmploymentVariancePct = Number(
    (youthEmploymentSharePct - targets.youthEmploymentThresholdPct).toFixed(1),
  );

  return {
    femaleLedSharePct,
    youthEmploymentSharePct,
    femaleLedVariancePct,
    youthEmploymentVariancePct,
    femaleLedStatus: classify(
      femaleLedSharePct,
      targets.femaleLedShareTargetPct,
    ),
    youthEmploymentStatus: classify(
      youthEmploymentSharePct,
      targets.youthEmploymentThresholdPct,
    ),
  };
}

export function buildInclusionComplianceInsights(
  records: BoiStatePlacement[],
  targets: InclusionTargetConfig = DEFAULT_TARGETS,
): InclusionComplianceInsights {
  const totals = records.reduce(
    (acc, item) => {
      acc.femaleLedStartups += item.femaleLedStartups;
      acc.totalStartups += item.totalStartups;
      acc.youthEmployees += item.youthEmployees;
      acc.totalEmployees += item.totalEmployees;
      return acc;
    },
    {
      femaleLedStartups: 0,
      totalStartups: 0,
      youthEmployees: 0,
      totalEmployees: 0,
    },
  );

  const nationalSnapshot = buildSnapshot(
    totals.femaleLedStartups,
    totals.totalStartups,
    totals.youthEmployees,
    totals.totalEmployees,
    targets,
  );

  const stateSnapshots = records.map((item) => ({
    state: item.state,
    snapshot: buildSnapshot(
      item.femaleLedStartups,
      item.totalStartups,
      item.youthEmployees,
      item.totalEmployees,
      targets,
    ),
  }));

  const alerts: InclusionAlert[] = [];

  if (nationalSnapshot.femaleLedStatus !== "on_track") {
    alerts.push({
      metric: "female_led_share",
      scopeType: "national",
      scopeId: "Nigeria",
      severity: severityFromVariance(nationalSnapshot.femaleLedVariancePct),
      reason: "Female-led startup share is below target.",
      currentValue: nationalSnapshot.femaleLedSharePct,
      targetValue: targets.femaleLedShareTargetPct,
      variancePct: nationalSnapshot.femaleLedVariancePct,
    });
  }

  if (nationalSnapshot.youthEmploymentStatus !== "on_track") {
    alerts.push({
      metric: "youth_employment_threshold",
      scopeType: "national",
      scopeId: "Nigeria",
      severity: severityFromVariance(
        nationalSnapshot.youthEmploymentVariancePct,
      ),
      reason: "Youth employment share is below Startup Act threshold.",
      currentValue: nationalSnapshot.youthEmploymentSharePct,
      targetValue: targets.youthEmploymentThresholdPct,
      variancePct: nationalSnapshot.youthEmploymentVariancePct,
    });
  }

  stateSnapshots.forEach((state) => {
    if (state.snapshot.femaleLedStatus === "off_track") {
      alerts.push({
        metric: "female_led_share",
        scopeType: "state",
        scopeId: state.state,
        severity: severityFromVariance(state.snapshot.femaleLedVariancePct),
        reason: "State female-led share is materially below target.",
        currentValue: state.snapshot.femaleLedSharePct,
        targetValue: targets.femaleLedShareTargetPct,
        variancePct: state.snapshot.femaleLedVariancePct,
      });
    }

    if (state.snapshot.youthEmploymentStatus === "off_track") {
      alerts.push({
        metric: "youth_employment_threshold",
        scopeType: "state",
        scopeId: state.state,
        severity: severityFromVariance(
          state.snapshot.youthEmploymentVariancePct,
        ),
        reason: "State youth employment share is below threshold.",
        currentValue: state.snapshot.youthEmploymentSharePct,
        targetValue: targets.youthEmploymentThresholdPct,
        variancePct: state.snapshot.youthEmploymentVariancePct,
      });
    }
  });

  alerts.sort((a, b) => {
    const rank = { high: 3, medium: 2, low: 1 };
    return rank[b.severity] - rank[a.severity];
  });

  return {
    targetConfig: targets,
    nationalSnapshot,
    stateSnapshots,
    alerts: alerts.slice(0, 12),
  };
}
