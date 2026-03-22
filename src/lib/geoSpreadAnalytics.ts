import type { BoiStatePlacement } from "@/data/mockData";

export type GeoAlertSeverity = "Low" | "Medium" | "High";

export interface GeoSummary {
  coveredStates: number;
  totalStates: number;
  coveragePct: number;
  femaleLedSharePct: number;
  ruralSharePct: number;
}

export interface GeoAlert {
  state: string;
  severity: GeoAlertSeverity;
  reason: string;
  recommendedAction: string;
}

export interface TopStatePenetrationRecord {
  state: string;
  startups: number;
  placements: number;
}

export interface TopJobsByStateRecord {
  state: string;
  jobs: number;
}

export interface GeoSpreadInsights {
  summary: GeoSummary;
  alerts: GeoAlert[];
  topStatePenetration: TopStatePenetrationRecord[];
  topJobsByState: TopJobsByStateRecord[];
}

interface BuildInsightsOptions {
  topLimit?: number;
  alertLimit?: number;
}

const severityRank: Record<GeoAlertSeverity, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function buildGeoSpreadInsights(
  records: BoiStatePlacement[],
  options: BuildInsightsOptions = {},
): GeoSpreadInsights {
  const topLimit = options.topLimit ?? 12;
  const alertLimit = options.alertLimit ?? 10;

  const coveredStates = records.filter(
    (item) => item.activeStartups > 0,
  ).length;
  const totalStates = records.length;
  const coveragePct =
    totalStates === 0 ? 0 : Math.round((coveredStates / totalStates) * 100);

  const femaleLed = records.reduce(
    (sum, item) => sum + item.femaleLedStartups,
    0,
  );
  const totalStartups = records.reduce(
    (sum, item) => sum + item.totalStartups,
    0,
  );
  const femaleLedSharePct =
    totalStartups === 0 ? 0 : Math.round((femaleLed / totalStartups) * 100);

  const ruralParticipants = records.reduce(
    (sum, item) => sum + item.ruralParticipants,
    0,
  );
  const metroParticipants = records.reduce(
    (sum, item) => sum + item.metroParticipants,
    0,
  );
  const totalParticipants = ruralParticipants + metroParticipants;
  const ruralSharePct =
    totalParticipants === 0
      ? 0
      : Math.round((ruralParticipants / totalParticipants) * 100);

  const alerts = records
    .flatMap((item) => {
      const femaleShare =
        item.totalStartups === 0
          ? 0
          : (item.femaleLedStartups / item.totalStartups) * 100;
      const next: GeoAlert[] = [];

      if (item.activeStartups === 0) {
        next.push({
          state: item.state,
          severity: "High",
          reason: "No active startups in current period.",
          recommendedAction:
            "Trigger targeted founder outreach and deploy an accelerator intake campaign for this state.",
        });
      }

      if (item.activeStartups > 0 && item.jobsCreated < 50) {
        next.push({
          state: item.state,
          severity: "Medium",
          reason: "Jobs created below baseline threshold.",
          recommendedAction:
            "Launch employment acceleration support and strengthen startup hiring incentives.",
        });
      }

      if (item.totalStartups > 0 && femaleShare < 50) {
        next.push({
          state: item.state,
          severity: femaleShare < 35 ? "High" : "Medium",
          reason: "Female-led startup share below 50% target.",
          recommendedAction:
            "Prioritize women-led pipeline sourcing and activate focused mentorship grants.",
        });
      }

      if (item.activeStartups > 0 && item.complianceRate < 90) {
        next.push({
          state: item.state,
          severity: "Low",
          reason: "Compliance rate below 90% baseline.",
          recommendedAction:
            "Schedule compliance clinics and provide regulatory filing support for active founders.",
        });
      }

      return next;
    })
    .sort((a, b) => severityRank[b.severity] - severityRank[a.severity])
    .slice(0, alertLimit);

  const topStatePenetration = [...records]
    .sort((a, b) => b.activeStartups - a.activeStartups)
    .slice(0, topLimit)
    .map((item) => ({
      state: item.state,
      startups: item.activeStartups,
      placements: item.placements,
    }));

  const topJobsByState = [...records]
    .sort((a, b) => b.jobsCreated - a.jobsCreated)
    .slice(0, topLimit)
    .map((item) => ({
      state: item.state,
      jobs: item.jobsCreated,
    }));

  return {
    summary: {
      coveredStates,
      totalStates,
      coveragePct,
      femaleLedSharePct,
      ruralSharePct,
    },
    alerts,
    topStatePenetration,
    topJobsByState,
  };
}
