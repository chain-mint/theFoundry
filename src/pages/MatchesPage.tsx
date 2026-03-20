import { useMemo } from "react";
import { matchData } from "@/data/mockData";
import { boiPortfolioOverview, trainingRoiData } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMatchesPageIntent } from "@/lib/roleNavigation";

const statusColors: Record<string, BadgeProps["variant"]> = {
  Pending: "secondary",
  Accepted: "default",
  Interview: "outline",
};

export default function MatchesPage() {
  const { user } = useAuth();
  const role = user?.role ?? "talent";
  const pageIntent = getMatchesPageIntent(role);
  const isBoi = role === "boi-officer";
  const isAdmin = role === "admin";

  const pipelineStats = useMemo(() => {
    const pending = matchData.filter((item) => item.status === "Pending").length;
    const interview = matchData.filter((item) => item.status === "Interview").length;
    const accepted = matchData.filter((item) => item.status === "Accepted").length;
    const total = matchData.length;
    const conversionRate = total === 0 ? 0 : Math.round((accepted / total) * 100);
    return { pending, interview, accepted, total, conversionRate };
  }, []);

  const adminSignals = useMemo(() => {
    const latest = trainingRoiData[trainingRoiData.length - 1];
    const trained = latest?.trained ?? 0;
    const foundingEngineers = latest?.foundingEngineers ?? 0;
    const retained = latest?.retainedAfter90Days ?? 0;
    const retentionSignal = foundingEngineers === 0 ? 0 : Math.round((retained / foundingEngineers) * 100);
    return { trained, foundingEngineers, retained, retentionSignal };
  }, []);

  if (!user) return null;

  if (isBoi || isAdmin) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">{pageIntent.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{pageIntent.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Match Requests</p>
            <p className="text-2xl font-bold mt-1">{pipelineStats.total}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold mt-1">{pipelineStats.pending}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Interview Stage</p>
            <p className="text-2xl font-bold mt-1">{pipelineStats.interview}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Accepted</p>
            <p className="text-2xl font-bold mt-1">{pipelineStats.accepted}</p>
            <p className="text-xs text-muted-foreground mt-1">{pipelineStats.conversionRate}% conversion</p>
          </div>
        </div>

        {isAdmin && (
          <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h2 className="text-sm font-semibold">Retention Signal</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {adminSignals.retentionSignal}% of recent founding-engineer conversions are retained after 90 days ({adminSignals.retained}/{adminSignals.foundingEngineers}).
            </p>
            <p className="text-xs text-muted-foreground mt-1">Training baseline: {adminSignals.trained} graduates in latest period.</p>
          </div>
        )}

        <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="p-4 border-b border-border/50">
            <h2 className="text-sm font-semibold">
              {isBoi ? "Portfolio Matching Monitor" : "Placement Pipeline Monitor"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {isBoi
                ? "Read-only oversight of startup matching and grant progression."
                : "Operational monitoring of throughput and status transitions."}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Talent</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Startup</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Score</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Match Status</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Grant Status</th>
                </tr>
              </thead>
              <tbody>
                {matchData.map((item, index) => {
                  const startupRecord = boiPortfolioOverview.find((record) => record.startup === item.startup);
                  return (
                    <tr key={`${item.talent}-${item.startup}-${index}`} className="border-b border-border/20 hover:bg-muted/30">
                      <td className="p-3 font-medium">{item.talent}</td>
                      <td className="p-3">{item.startup}</td>
                      <td className="p-3 text-muted-foreground">{item.role}</td>
                      <td className="p-3">{item.score}%</td>
                      <td className="p-3"><Badge variant={statusColors[item.status] ?? "secondary"}>{item.status}</Badge></td>
                      <td className="p-3">
                        <Badge variant={startupRecord?.grantStatus === "Unlocked" ? "default" : "secondary"}>
                          {startupRecord?.grantStatus ?? "In Review"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">{pageIntent.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pageIntent.subtitle}</p>
      </div>
      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Talent</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Startup</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Score</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {matchData.map((m, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{m.talent}</td>
                  <td className="p-4">{m.startup}</td>
                  <td className="p-4 text-muted-foreground">{m.role}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span className="font-semibold">{m.score}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusColors[m.status] ?? "secondary"}>{m.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
