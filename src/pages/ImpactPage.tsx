import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  impactStats,
  sectorDistribution,
  monthlyData,
  boiPortfolioOverview,
  boiTalentHeatmap,
  geoTrendSnapshots,
  nigerianStateMaster,
  startups,
  discoverOpportunities,
} from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Users, Building2, DollarSign, Download, FileText, ShieldCheck, Loader2, MapPinned, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getImpactPageIntent } from "@/lib/roleNavigation";
import { buildGeoSpreadInsights } from "@/lib/geoSpreadAnalytics";
import { buildIdiceKpiFramework } from "@/lib/idiceKpiAnalytics";
import { buildInclusionComplianceInsights } from "@/lib/inclusionComplianceAnalytics";

const COLORS = ["hsl(211,100%,52%)", "hsl(160,84%,39%)", "hsl(280,70%,55%)", "hsl(35,95%,55%)", "hsl(350,70%,55%)", "hsl(200,50%,50%)"];

export default function ImpactPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const role = user?.role ?? "talent";
  const isBoi = role === "boi-officer";
  const isAdmin = role === "admin";
  const isFounder = role === "founder";
  const isTalent = role === "talent";
  const pageIntent = getImpactPageIntent(role);
  const [exporting, setExporting] = useState<"pdf" | "csv" | null>(null);

  const [cohortFilter, setCohortFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [milestoneFilter, setMilestoneFilter] = useState("all");

  const cohorts = useMemo(
    () => ["all", ...Array.from(new Set(boiPortfolioOverview.map((item) => item.cohort)))],
    [],
  );
  const states = useMemo(
    () => ["all", ...nigerianStateMaster.map((item) => item.stateName)],
    [],
  );
  const milestones = useMemo(
    () => ["all", ...Array.from(new Set(boiPortfolioOverview.map((item) => item.milestone)))],
    [],
  );

  const filteredPortfolio = useMemo(
    () =>
      boiPortfolioOverview.filter((item) => {
        if (cohortFilter !== "all" && item.cohort !== cohortFilter) return false;
        if (stateFilter !== "all" && item.state !== stateFilter) return false;
        if (milestoneFilter !== "all" && item.milestone !== milestoneFilter) return false;
        return true;
      }),
    [cohortFilter, stateFilter, milestoneFilter],
  );

  const filteredGeoSpread = useMemo(
    () =>
      boiTalentHeatmap.filter((item) => {
        if (cohortFilter !== "all" && item.cohort !== cohortFilter) return false;
        if (stateFilter !== "all" && item.state !== stateFilter) return false;
        return true;
      }),
    [cohortFilter, stateFilter],
  );

  const geoInsights = useMemo(
    () => buildGeoSpreadInsights(filteredGeoSpread, { alertLimit: 6, topLimit: 12 }),
    [filteredGeoSpread],
  );
  const geoSummary = {
    ...geoInsights.summary,
    femaleShare: geoInsights.summary.femaleLedSharePct,
    ruralShare: geoInsights.summary.ruralSharePct,
  };
  const geoAlerts = geoInsights.alerts;
  const topStatePenetration = geoInsights.topStatePenetration;
  const topJobsByState = geoInsights.topJobsByState;

  const kpiFramework = useMemo(
    () => {
      const startupSectors = Object.fromEntries([
        ...startups.map((item) => [item.name, item.sector]),
        ...discoverOpportunities.map((item) => [item.name, item.sector]),
      ]);
      return buildIdiceKpiFramework({
        portfolio: filteredPortfolio,
        geoSpread: filteredGeoSpread,
        geoTrend: geoTrendSnapshots,
        startupSectors,
      });
    },
    [filteredPortfolio, filteredGeoSpread],
  );

  const inclusionInsights = useMemo(
    () => buildInclusionComplianceInsights(filteredGeoSpread),
    [filteredGeoSpread],
  );

  const reportSummary = useMemo(() => {
    const fellowsPlaced = filteredPortfolio.reduce((sum, item) => sum + item.talentPlaced, 0);
    const grantsUnlocked = filteredPortfolio.filter((item) => item.grantStatus === "Unlocked").length;
    const complianceVerified = filteredPortfolio.filter((item) => item.compliance === "Verified").length;
    return { fellowsPlaced, grantsUnlocked, complianceVerified };
  }, [filteredPortfolio]);

  const statLabels = useMemo(() => {
    if (isTalent) {
      return {
        placed: "My Placement Ecosystem",
        jobs: "Jobs from Matched Teams",
        startups: "Active Startups",
        equity: "Equity Pool Outlook",
      };
    }
    if (isFounder) {
      return {
        placed: "Talents Placed",
        jobs: "Jobs Created",
        startups: "Active Startups",
        equity: "Equity Pool",
      };
    }
    if (isAdmin) {
      return {
        placed: "Talents Placed",
        jobs: "Jobs Created",
        startups: "Active Startups",
        equity: "Program Equity Pool",
      };
    }
    return {
      placed: "Talents Placed",
      jobs: "Jobs Created",
      startups: "Active Startups",
      equity: "Equity Pool",
    };
  }, [isAdmin, isFounder, isTalent]);

  const sectorTitle = isTalent
    ? "Ecosystem Sector Mix"
    : isFounder
      ? "Market Sector Mix"
      : "Sector Distribution";

  const startupTrendTitle = isAdmin
    ? "Startup Formation Trend"
    : "New Startups by Month";

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const downloadCsv = () => {
    if (filteredPortfolio.length === 0) {
      toast({ title: "No records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("csv");
    const header = "Founder,Startup,Cohort,State,Milestone,GrantStatus,TalentPlaced,JobsCreated,Compliance\n";
    const rows = filteredPortfolio
      .map((item) => [
        item.founder,
        item.startup,
        item.cohort,
        item.state,
        item.milestone,
        item.grantStatus,
        item.talentPlaced,
        item.jobsCreated,
        item.compliance,
      ].join(","))
      .join("\n");

    triggerDownload("idice-boi-impact-report.csv", `${header}${rows}\n`, "text/csv;charset=utf-8;");
    toast({ title: "CSV Downloaded", description: "BOI impact report exported." });
    setExporting(null);
  };

  const downloadPdf = () => {
    if (filteredPortfolio.length === 0) {
      toast({ title: "No records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("pdf");
    const lines = [
      "iDICE / BOI Oversight Impact Report (PDF)",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Filters -> Cohort: ${cohortFilter}, State: ${stateFilter}, Milestone: ${milestoneFilter}`,
      `Fellows Placed: ${reportSummary.fellowsPlaced}`,
      `Grants Unlocked: ${reportSummary.grantsUnlocked}`,
      `Compliance Verified: ${reportSummary.complianceVerified}/${filteredPortfolio.length}`,
      "",
      "This is a simulated PDF export for demo purposes.",
    ];
    triggerDownload("idice-boi-impact-report.pdf", lines.join("\n"), "application/pdf");
    toast({ title: "PDF Generated", description: "BOI oversight report exported." });
    setExporting(null);
  };

  const downloadGeoCsv = () => {
    if (filteredGeoSpread.length === 0) {
      toast({ title: "No geo records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("csv");
    const header = "State,Cohort,Placements,JobsCreated,ActiveStartups,FemaleLedStartups,TotalStartups,FemaleLedSharePct,RuralParticipants,MetroParticipants,RuralSharePct,ComplianceRate\n";
    const rows = filteredGeoSpread
      .map((item) => {
        const femaleShare = item.totalStartups === 0 ? 0 : Math.round((item.femaleLedStartups / item.totalStartups) * 100);
        const totalParticipants = item.ruralParticipants + item.metroParticipants;
        const ruralShare = totalParticipants === 0 ? 0 : Math.round((item.ruralParticipants / totalParticipants) * 100);
        return [
          item.state,
          item.cohort,
          item.placements,
          item.jobsCreated,
          item.activeStartups,
          item.femaleLedStartups,
          item.totalStartups,
          femaleShare,
          item.ruralParticipants,
          item.metroParticipants,
          ruralShare,
          item.complianceRate,
        ].join(",");
      })
      .join("\n");

    triggerDownload(
      "idice-boi-geo-spread-report.csv",
      `${header}${rows}\n`,
      "text/csv;charset=utf-8;",
    );
    toast({ title: "Geo CSV Downloaded", description: "State-level geographic spread report exported." });
    setExporting(null);
  };

  const downloadGeoSnapshotPdf = () => {
    if (filteredGeoSpread.length === 0) {
      toast({ title: "No geo records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("pdf");
    const lines = [
      "iDICE / BOI Geographic Spread Snapshot (PDF)",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Filters -> Cohort: ${cohortFilter}, State: ${stateFilter}`,
      `Coverage: ${geoSummary.coveredStates}/${geoSummary.totalStates} (${geoSummary.coveragePct}%)`,
      `Female-Led Share: ${geoSummary.femaleShare}%`,
      `Rural Participation: ${geoSummary.ruralShare}%`,
      `Underserved Alerts: ${geoAlerts.length}`,
      "",
      "Trend Snapshot:",
      ...geoTrendSnapshots.map((item) =>
        `${item.month}: coverage ${item.coveragePct}% | female-led ${item.femaleLedSharePct}% | rural ${item.ruralSharePct}% | jobs ${item.jobsCreated}`,
      ),
      "",
      "This is a simulated PDF export for geo reporting pack purposes.",
    ];

    triggerDownload(
      "idice-boi-geo-spread-snapshot.pdf",
      lines.join("\n"),
      "application/pdf",
    );
    toast({ title: "Geo Snapshot Exported", description: "Geographic trend snapshot report exported." });
    setExporting(null);
  };

  const downloadKpiCsv = () => {
    if (kpiFramework.snapshots.length === 0) {
      toast({ title: "No KPI records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("csv");
    const header = "KPI,Unit,Target,Actual,Variance,Status\n";
    const rows = kpiFramework.snapshots
      .map((item) => [
        item.label,
        item.unit,
        item.target,
        item.actual,
        item.variance,
        item.status,
      ].join(","))
      .join("\n");

    triggerDownload(
      "idice-kpi-framework.csv",
      `${header}${rows}\n`,
      "text/csv;charset=utf-8;",
    );
    toast({ title: "KPI CSV Downloaded", description: "KPI framework report pack exported." });
    setExporting(null);
  };

  const downloadKpiSnapshotPdf = () => {
    if (kpiFramework.snapshots.length === 0) {
      toast({ title: "No KPI records to export", description: "Update filters and try again." });
      return;
    }
    setExporting("pdf");
    const lines = [
      "iDICE KPI Framework Snapshot (PDF)",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Filters -> Cohort: ${cohortFilter}, State: ${stateFilter}, Milestone: ${milestoneFilter}`,
      "",
      "Target vs Actual:",
      ...kpiFramework.snapshots.map((item) =>
        `${item.label}: actual ${item.actual} vs target ${item.target} (${item.status})`,
      ),
      "",
      "Trend Snapshot:",
      ...kpiFramework.trend.map((item) =>
        `${item.month}: jobs ${item.jobsCreated}, parity ${item.genderParity}%, spread ${item.geographicSpread}%`,
      ),
      "",
      "Metric Metadata:",
      ...kpiFramework.definitions.map((item) =>
        `${item.label} | owner: ${item.owner} | cadence: ${item.updateCadence} | source: ${item.source}`,
      ),
      "",
      "Target Revision History:",
      ...kpiFramework.targetHistory.map((item) =>
        `${item.changedAt} | ${item.kpiId}: ${item.previousTarget} -> ${item.nextTarget} | by ${item.changedBy}`,
      ),
      "",
      "This is a simulated KPI report pack export.",
    ];

    triggerDownload(
      "idice-kpi-framework-snapshot.pdf",
      lines.join("\n"),
      "application/pdf",
    );
    toast({ title: "KPI PDF Exported", description: "KPI framework snapshot exported." });
    setExporting(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{pageIntent.title}</h1>
          {isBoi && (
            <Badge className="bg-accent/15 text-accent border-accent/30">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              Compliance Monitoring
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {pageIntent.subtitle}
        </p>
      </div>

      {isBoi && (
        <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={cohortFilter} onValueChange={setCohortFilter}>
                <SelectTrigger className="bg-muted/40">
                  <SelectValue placeholder="Filter by cohort" />
                </SelectTrigger>
                <SelectContent>
                  {cohorts.map((cohort) => (
                    <SelectItem key={cohort} value={cohort}>
                      {cohort === "all" ? "All Cohorts" : cohort}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="bg-muted/40">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state === "all" ? "All States" : state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={milestoneFilter} onValueChange={setMilestoneFilter}>
                <SelectTrigger className="bg-muted/40">
                  <SelectValue placeholder="Filter by milestone" />
                </SelectTrigger>
                <SelectContent>
                  {milestones.map((milestone) => (
                    <SelectItem key={milestone} value={milestone}>
                      {milestone === "all" ? "All Milestones" : milestone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Report Preview: <span className="font-medium text-foreground">{reportSummary.fellowsPlaced}</span> fellows placed, <span className="font-medium text-foreground">{reportSummary.grantsUnlocked}</span> grants unlocked.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadPdf}>
                  {exporting === "pdf" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <FileText className="h-4 w-4 mr-1.5" />}
                  Download PDF
                </Button>
                <Button size="sm" onClick={downloadCsv}>
                  {exporting === "csv" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
                  Download CSV
                </Button>
                <Button variant="outline" size="sm" onClick={downloadGeoSnapshotPdf}>
                  {exporting === "pdf" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <FileText className="h-4 w-4 mr-1.5" />}
                  Geo Snapshot PDF
                </Button>
                <Button variant="outline" size="sm" onClick={downloadGeoCsv}>
                  {exporting === "csv" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
                  Geo Spread CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBoi && (
        <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "140ms" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold">National Geographic Spread Snapshot</h2>
            <span className="text-xs text-muted-foreground">State penetration, female-led share, and underserved-state signals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPinned className="h-3.5 w-3.5" /> State Coverage</p>
              <p className="text-lg font-semibold mt-1">{geoSummary.coveredStates}/{geoSummary.totalStates}</p>
              <p className="text-xs text-muted-foreground mt-1">{geoSummary.coveragePct}% penetration</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Female-Led Share</p>
              <p className="text-lg font-semibold mt-1">{geoSummary.femaleShare}%</p>
              <p className="text-xs text-muted-foreground mt-1">Target: 50%</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Rural Participation</p>
              <p className="text-lg font-semibold mt-1">{geoSummary.ruralShare}%</p>
              <p className="text-xs text-muted-foreground mt-1">Rural vs metro split</p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Underserved Alerts</p>
              <p className="text-lg font-semibold mt-1">{geoAlerts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Top signals for action</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">State</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Severity</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Reason</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {geoAlerts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-2 text-xs text-muted-foreground">No underserved-state alerts for this filter set.</td>
                  </tr>
                )}
                {geoAlerts.map((alert, i) => (
                  <tr key={`${alert.state}-${alert.reason}-${i}`} className="border-b border-border/20">
                    <td className="p-2 font-medium">{alert.state}</td>
                    <td className="p-2">
                      <Badge className={alert.severity === "High" ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}>
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">{alert.reason}</td>
                    <td className="p-2 text-muted-foreground">{alert.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isBoi && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "180ms" }}>
            <h2 className="text-sm font-semibold mb-4">State Penetration (Top 12)</h2>
            <p className="text-xs text-muted-foreground mb-3">Proxy view of active startup spread and placements.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topStatePenetration}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
                  <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={62} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 25%, 11%)",
                      border: "1px solid hsl(222, 20%, 18%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="startups" fill="hsl(211, 100%, 52%)" name="Active Startups" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placements" fill="hsl(160, 84%, 39%)" name="Placements" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-sm font-semibold mb-4">Jobs Created by State (Top 12)</h2>
            <p className="text-xs text-muted-foreground mb-3">Dedicated state-level jobs footprint for BOI reporting reviews.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topJobsByState}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
                  <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={62} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 25%, 11%)",
                      border: "1px solid hsl(222, 20%, 18%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="jobs" fill="hsl(35, 95%, 55%)" name="Jobs Created" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {(isBoi || isAdmin) && (
        <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "220ms" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold">iDICE KPI Framework (v1)</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Target vs actual tracking across program success criteria</span>
              <Button variant="outline" size="sm" onClick={downloadKpiSnapshotPdf}>
                {exporting === "pdf" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <FileText className="h-4 w-4 mr-1.5" />}
                KPI PDF
              </Button>
              <Button variant="outline" size="sm" onClick={downloadKpiCsv}>
                {exporting === "csv" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
                KPI CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
            {kpiFramework.snapshots.map((kpi) => (
              <div key={kpi.kpiId} className="rounded-md border border-border/50 bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <Badge
                    className={
                      kpi.status === "on_track"
                        ? "bg-accent/15 text-accent border-accent/30"
                        : kpi.status === "watch"
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                    }
                  >
                    {kpi.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-lg font-semibold mt-1">
                  {kpi.unit === "currency"
                    ? `$${kpi.actual.toLocaleString()}`
                    : kpi.unit === "percent"
                      ? `${kpi.actual}%`
                      : kpi.actual.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Target: {kpi.unit === "currency" ? `$${kpi.target.toLocaleString()}` : `${kpi.target}${kpi.unit === "percent" ? "%" : ""}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Variance: {kpi.variance >= 0 ? "+" : ""}{kpi.variance.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">KPI Trend Snapshot</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiFramework.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 25%, 11%)",
                      border: "1px solid hsl(222, 20%, 18%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="jobsCreated" name="Jobs Created" stroke="hsl(211, 100%, 52%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="genderParity" name="Gender Parity %" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="geographicSpread" name="Geographic Spread %" stroke="hsl(35, 95%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="rounded-md border border-border/50 bg-muted/20 p-3 overflow-x-auto">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Breakdown by State</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1">State</th>
                    <th className="text-left p-1">Jobs</th>
                    <th className="text-left p-1">Startups</th>
                    <th className="text-left p-1">Female %</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiFramework.breakdownByState.slice(0, 8).map((row) => (
                    <tr key={`state-${row.label}`} className="border-b border-border/20">
                      <td className="p-1">{row.label}</td>
                      <td className="p-1">{row.jobsCreated}</td>
                      <td className="p-1">{row.startups}</td>
                      <td className="p-1">{row.femaleLedSharePct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-md border border-border/50 bg-muted/20 p-3 overflow-x-auto">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Breakdown by Cohort</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1">Cohort</th>
                    <th className="text-left p-1">Jobs</th>
                    <th className="text-left p-1">Startups</th>
                    <th className="text-left p-1">Compliance %</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiFramework.breakdownByCohort.map((row) => (
                    <tr key={`cohort-${row.label}`} className="border-b border-border/20">
                      <td className="p-1">{row.label}</td>
                      <td className="p-1">{row.jobsCreated}</td>
                      <td className="p-1">{row.startups}</td>
                      <td className="p-1">{row.complianceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-md border border-border/50 bg-muted/20 p-3 overflow-x-auto">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Breakdown by Sector</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1">Sector</th>
                    <th className="text-left p-1">Jobs</th>
                    <th className="text-left p-1">Startups</th>
                    <th className="text-left p-1">Compliance %</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiFramework.breakdownBySector.map((row) => (
                    <tr key={`sector-${row.label}`} className="border-b border-border/20">
                      <td className="p-1">{row.label}</td>
                      <td className="p-1">{row.jobsCreated}</td>
                      <td className="p-1">{row.startups}</td>
                      <td className="p-1">{row.complianceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-md border border-border/50 bg-muted/20 p-3 overflow-x-auto">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Metric Metadata</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1">KPI</th>
                    <th className="text-left p-1">Owner</th>
                    <th className="text-left p-1">Cadence</th>
                    <th className="text-left p-1">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiFramework.definitions.map((row) => (
                    <tr key={`meta-${row.kpiId}`} className="border-b border-border/20">
                      <td className="p-1">{row.label}</td>
                      <td className="p-1">{row.owner}</td>
                      <td className="p-1">{row.updateCadence}</td>
                      <td className="p-1">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-muted-foreground mt-2">
                Generated at: {new Date(kpiFramework.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-md border border-border/50 bg-muted/20 p-3 overflow-x-auto">
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Target Revision History</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-1">Date</th>
                    <th className="text-left p-1">KPI</th>
                    <th className="text-left p-1">Change</th>
                    <th className="text-left p-1">By</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiFramework.targetHistory.map((row, idx) => (
                    <tr key={`revision-${row.kpiId}-${idx}`} className="border-b border-border/20">
                      <td className="p-1">{row.changedAt}</td>
                      <td className="p-1">{row.kpiId}</td>
                      <td className="p-1">{row.previousTarget}{" -> "}{row.nextTarget}</td>
                      <td className="p-1">{row.changedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(isBoi || isAdmin) && (
        <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold">Gender Inclusion & Youth Employment Compliance</h2>
            <span className="text-xs text-muted-foreground">Target tracking for female-led share and Startup Act youth threshold</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Female-Led Share</p>
              <p className="text-lg font-semibold mt-1">{inclusionInsights.nationalSnapshot.femaleLedSharePct}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Target {inclusionInsights.targetConfig.femaleLedShareTargetPct}%
              </p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Youth Employment Share</p>
              <p className="text-lg font-semibold mt-1">{inclusionInsights.nationalSnapshot.youthEmploymentSharePct}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Target {inclusionInsights.targetConfig.youthEmploymentThresholdPct}%
              </p>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Female-Led Status</p>
              <Badge
                className={
                  inclusionInsights.nationalSnapshot.femaleLedStatus === "on_track"
                    ? "bg-accent/15 text-accent border-accent/30 mt-2"
                    : inclusionInsights.nationalSnapshot.femaleLedStatus === "watch"
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/30 mt-2"
                      : "bg-destructive/10 text-destructive border-destructive/30 mt-2"
                }
              >
                {inclusionInsights.nationalSnapshot.femaleLedStatus.replace("_", " ")}
              </Badge>
            </div>
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Youth Threshold Status</p>
              <Badge
                className={
                  inclusionInsights.nationalSnapshot.youthEmploymentStatus === "on_track"
                    ? "bg-accent/15 text-accent border-accent/30 mt-2"
                    : inclusionInsights.nationalSnapshot.youthEmploymentStatus === "watch"
                      ? "bg-amber-500/15 text-amber-500 border-amber-500/30 mt-2"
                      : "bg-destructive/10 text-destructive border-destructive/30 mt-2"
                }
              >
                {inclusionInsights.nationalSnapshot.youthEmploymentStatus.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Metric</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Scope</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Current</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Target</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Variance</th>
                  <th className="text-left p-2 text-xs uppercase tracking-wider text-muted-foreground">Severity</th>
                </tr>
              </thead>
              <tbody>
                {inclusionInsights.alerts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-2 text-xs text-muted-foreground">
                      No compliance alerts for current filters.
                    </td>
                  </tr>
                )}
                {inclusionInsights.alerts.map((alert, i) => (
                  <tr key={`${alert.metric}-${alert.scopeId}-${i}`} className="border-b border-border/20">
                    <td className="p-2 text-muted-foreground">{alert.metric === "female_led_share" ? "Female-Led Share" : "Youth Employment"}</td>
                    <td className="p-2 text-muted-foreground">{alert.scopeType}: {alert.scopeId}</td>
                    <td className="p-2">{alert.currentValue}%</td>
                    <td className="p-2">{alert.targetValue}%</td>
                    <td className="p-2">{alert.variancePct}%</td>
                    <td className="p-2">
                      <Badge
                        className={
                          alert.severity === "high"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : alert.severity === "medium"
                              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                              : "bg-primary/15 text-primary border-primary/30"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={statLabels.placed} value={impactStats.talentsPlaced} icon={Users} delay={100} />
        <StatCard title={statLabels.jobs} value={impactStats.jobsCreated.toLocaleString()} icon={TrendingUp} delay={200} />
        <StatCard title={statLabels.startups} value={impactStats.activeStartups} icon={Building2} delay={300} />
        <StatCard title={statLabels.equity} value={impactStats.equityDistributed} icon={DollarSign} delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2 className="text-sm font-semibold mb-4">{sectorTitle}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {sectorDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 25%, 11%)",
                    border: "1px solid hsl(222, 20%, 18%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {sectorDistribution.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h2 className="text-sm font-semibold mb-4">{startupTrendTitle}</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 25%, 11%)",
                    border: "1px solid hsl(222, 20%, 18%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="startups" fill="hsl(211, 100%, 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
