import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  boiPortfolioOverview,
  boiTalentHeatmap,
  geoTrendSnapshots,
  nigerianStateMaster,
} from "@/data/mockData";
import { Activity, CheckCircle2, Building2, Users, ShieldCheck, BellRing, RefreshCcw, MapPinned, AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getFinalizedFounderProjects,
  getIdiceBoardNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToIdiceBoardUpdates,
  type FinalizedFounderProject,
  type IdiceBoardNotification,
} from "@/lib/idiceBoardStore";
import { buildGeoSpreadInsights } from "@/lib/geoSpreadAnalytics";
import { buildInclusionComplianceInsights } from "@/lib/inclusionComplianceAnalytics";

export default function BoiOversightDashboard() {
  const { user } = useAuth();
  const [cohortFilter, setCohortFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [milestoneFilter, setMilestoneFilter] = useState("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [finalizedStageFilter, setFinalizedStageFilter] = useState("all");
  const [finalizedProjects, setFinalizedProjects] = useState<FinalizedFounderProject[]>([]);
  const [boardNotifications, setBoardNotifications] = useState<IdiceBoardNotification[]>([]);

  const syncBoardData = useCallback(() => {
    setFinalizedProjects(getFinalizedFounderProjects());
    setBoardNotifications(getIdiceBoardNotifications());
  }, []);

  useEffect(() => {
    syncBoardData();
  }, [syncBoardData]);

  useEffect(() => {
    const cleanup = subscribeToIdiceBoardUpdates(syncBoardData);
    return cleanup;
  }, [syncBoardData]);

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

  const filteredHeatmap = useMemo(
    () =>
      boiTalentHeatmap.filter((item) => {
        if (cohortFilter !== "all" && item.cohort !== cohortFilter) return false;
        if (stateFilter !== "all" && item.state !== stateFilter) return false;
        return true;
      }),
    [cohortFilter, stateFilter],
  );

  const totals = useMemo(() => {
    const placements = filteredPortfolio.reduce((sum, item) => sum + item.talentPlaced, 0);
    const jobs = filteredPortfolio.reduce((sum, item) => sum + item.jobsCreated, 0);
    const verified = filteredPortfolio.filter((item) => item.compliance === "Verified").length;
    const unlocked = filteredPortfolio.filter((item) => item.grantStatus === "Unlocked").length;
    return { placements, jobs, verified, unlocked };
  }, [filteredPortfolio]);

  const geoInsights = useMemo(
    () => buildGeoSpreadInsights(filteredHeatmap, { alertLimit: 10, topLimit: 12 }),
    [filteredHeatmap],
  );
  const geoSummary = geoInsights.summary;
  const underservedAlerts = geoInsights.alerts;
  const topStatePenetration = geoInsights.topStatePenetration;
  const topJobsByState = geoInsights.topJobsByState;
  const inclusionInsights = useMemo(
    () => buildInclusionComplianceInsights(filteredHeatmap),
    [filteredHeatmap],
  );
  const rankedStateSpread = useMemo(
    () => [...filteredHeatmap].sort((a, b) => b.jobsCreated - a.jobsCreated),
    [filteredHeatmap],
  );

  const finalizedStages = useMemo(
    () => ["all", ...Array.from(new Set(finalizedProjects.map((item) => item.stage)))],
    [finalizedProjects],
  );

  const filteredFinalizedProjects = useMemo(() => {
    return finalizedProjects.filter((project) => {
      if (finalizedStageFilter !== "all" && project.stage !== finalizedStageFilter) return false;
      if (!projectSearch.trim()) return true;
      const q = projectSearch.trim().toLowerCase();
      return (
        project.projectName.toLowerCase().includes(q)
        || project.founderName.toLowerCase().includes(q)
        || project.industry.toLowerCase().includes(q)
      );
    });
  }, [finalizedProjects, finalizedStageFilter, projectSearch]);

  const unreadNotificationCount = useMemo(
    () => boardNotifications.filter((item) => !item.read).length,
    [boardNotifications],
  );

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Portfolio Oversight</h1>
          <Badge className="bg-primary/15 text-primary border-primary/30">
            <Activity className="h-3.5 w-3.5 mr-1.5" />
            Live Tracking
          </Badge>
          <Badge className="bg-accent/15 text-accent border-accent/30">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Compliance Verified
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time BOI view for grant milestone progression, talent placement, and compliance status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Founders Tracked" value={filteredPortfolio.length} icon={Building2} delay={100} />
        <StatCard title="Talents Placed" value={totals.placements} icon={Users} delay={200} />
        <StatCard title="Jobs Created" value={totals.jobs.toLocaleString()} icon={Activity} delay={300} />
        <StatCard title="Grants Unlocked" value={totals.unlocked} subtitle={`${totals.verified}/${filteredPortfolio.length} compliance verified`} icon={CheckCircle2} delay={400} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="State Coverage"
          value={`${geoSummary.coveredStates}/${geoSummary.totalStates}`}
          subtitle={`${geoSummary.coveragePct}% national penetration`}
          icon={MapPinned}
          delay={100}
        />
        <StatCard
          title="Female-Led Share"
          value={`${geoSummary.femaleLedSharePct}%`}
          subtitle="National startup distribution"
          icon={Users}
          delay={200}
        />
        <StatCard
          title="Rural Participation"
          value={`${geoSummary.ruralSharePct}%`}
          subtitle="Rural vs metro split"
          icon={Activity}
          delay={300}
        />
        <StatCard
          title="Underserved Alerts"
          value={underservedAlerts.length}
          subtitle="Top 10 risk signals"
          icon={AlertTriangle}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "145ms" }}>
          <h2 className="text-sm font-semibold mb-4">State Penetration (Top 12)</h2>
          <p className="text-xs text-muted-foreground mb-3">Proxy view of national coverage by active startups and placements.</p>
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

        <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "165ms" }}>
          <h2 className="text-sm font-semibold mb-4">Jobs Created by State (Top 12)</h2>
          <p className="text-xs text-muted-foreground mb-3">Dedicated jobs footprint chart for geographic performance reviews.</p>
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

      <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "185ms" }}>
        <h2 className="text-sm font-semibold mb-4">Geographic Trend Snapshot (Board Update)</h2>
        <p className="text-xs text-muted-foreground mb-3">National trendline for state penetration, female-led share, and rural participation.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={geoTrendSnapshots}>
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
              <Line type="monotone" dataKey="coveragePct" name="Coverage %" stroke="hsl(211, 100%, 52%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="femaleLedSharePct" name="Female-Led %" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ruralSharePct" name="Rural Share %" stroke="hsl(35, 95%, 55%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Finalized Founders" value={finalizedProjects.length} subtitle="Team formation complete" icon={CheckCircle2} delay={100} />
        <StatCard title="Board Notifications" value={boardNotifications.length} subtitle={`${unreadNotificationCount} unread`} icon={BellRing} delay={200} />
        <StatCard
          title="Finalized Teams"
          value={finalizedProjects.reduce((sum, project) => sum + project.teamMembers.length, 0)}
          subtitle="Total members across projects"
          icon={Users}
          delay={300}
        />
        <StatCard title="Filtered Projects" value={filteredFinalizedProjects.length} subtitle="After stage/search filters" icon={Building2} delay={400} />
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "160ms" }}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">iDICE Board Notifications</h2>
            <p className="text-xs text-muted-foreground">Founder finalization events from frontend</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={syncBoardData}>
              <RefreshCcw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                markAllNotificationsAsRead();
                syncBoardData();
              }}
              disabled={unreadNotificationCount === 0}
            >
              Mark All Read
            </Button>
          </div>
        </div>
        <div className="divide-y divide-border/30">
          {boardNotifications.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No notifications yet. Finalize a founder flow to generate board events.</div>
          )}
          {boardNotifications.slice(0, 8).map((notification) => (
            <div key={notification.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={notification.read ? "secondary" : "default"}>{notification.read ? "Read" : "Unread"}</Badge>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      markNotificationAsRead(notification.id);
                      syncBoardData();
                    }}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "180ms" }}>
        <div className="p-4 border-b border-border/50">
          <h2 className="text-sm font-semibold">Founder Team Finalization Tracker</h2>
          <p className="text-xs text-muted-foreground">Track finalized projects and inspect selected team members per founder.</p>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-border/40">
          <input
            className="rounded-md bg-muted/40 border border-border/50 px-3 py-2 text-sm"
            placeholder="Search by project, founder, or industry"
            value={projectSearch}
            onChange={(event) => setProjectSearch(event.target.value)}
          />
          <Select value={finalizedStageFilter} onValueChange={setFinalizedStageFilter}>
            <SelectTrigger className="bg-muted/40">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              {finalizedStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === "all" ? "All Stages" : stage.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setProjectSearch(""); setFinalizedStageFilter("all"); }}>
            Reset Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Founder</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Project</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Industry / Stage</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Strategy</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Team Members</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Finalized At</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Signing</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinalizedProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-sm text-muted-foreground">
                    No finalized founder projects found for current filters.
                  </td>
                </tr>
              )}
              {filteredFinalizedProjects.map((project) => (
                <tr key={project.id} className="border-b border-border/20 hover:bg-muted/20 align-top">
                  <td className="p-3 font-medium">{project.founderName}</td>
                  <td className="p-3">{project.projectName}</td>
                  <td className="p-3 text-muted-foreground">{project.industry} · {project.stage.toUpperCase()}</td>
                  <td className="p-3">
                    <Badge variant="secondary">{project.strategy === "growth_team" ? "Growth Team" : "Lean Team"}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      {project.teamMembers.map((member) => (
                        <div key={`${project.id}-${member.roleId}-${member.talentName}`} className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{member.talentName}</span> as {member.roleTitle}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{project.finalizedAt}</td>
                  <td className="p-3">
                    <Badge variant={project.signingStatus === "completed" ? "default" : "secondary"}>
                      {project.signingStatus === "completed" ? "Completed" : project.signingStatus === "in_progress" ? "In Progress" : "Pending"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Portfolio Overview</h2>
          <span className="text-xs text-muted-foreground">Streaming updates every 60s </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Founder</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Startup</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">State</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Milestone</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Grant</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Talent Placed</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Compliance</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolio.map((record) => (
                <tr key={record.id} className="border-b border-border/20 hover:bg-muted/30">
                  <td className="p-3 font-medium">{record.founder}</td>
                  <td className="p-3">{record.startup}</td>
                  <td className="p-3 text-muted-foreground">{record.state}</td>
                  <td className="p-3 text-muted-foreground">{record.milestone}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        record.grantStatus === "Unlocked"
                          ? "bg-accent/15 text-accent border-accent/30"
                          : record.grantStatus === "At Risk"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : "bg-primary/15 text-primary border-primary/30"
                      }
                    >
                      {record.grantStatus}
                    </Badge>
                  </td>
                  <td className="p-3 font-semibold text-primary">{record.talentPlaced}</td>
                  <td className="p-3">
                    <Badge variant="secondary" className={record.compliance === "Verified" ? "text-accent" : "text-destructive"}>
                      {record.compliance}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{record.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Talent Heatmap (Nigeria by State)</h2>
          <span className="text-xs text-muted-foreground">Placement concentration and job creation footprint</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">State</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Cohort</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Placements</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Jobs Created</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Active Startups</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Female-Led Share</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Rural vs Metro</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Compliance Rate</th>
              </tr>
            </thead>
            <tbody>
              {rankedStateSpread.map((item) => (
                <tr key={item.state} className="border-b border-border/20 hover:bg-muted/30">
                  <td className="p-3 font-medium">{item.state}</td>
                  <td className="p-3 text-muted-foreground">{item.cohort}</td>
                  <td className="p-3 font-semibold text-primary">{item.placements}</td>
                  <td className="p-3">{item.jobsCreated}</td>
                  <td className="p-3">{item.activeStartups}</td>
                  <td className="p-3">
                    {item.totalStartups === 0
                      ? "-"
                      : `${Math.round((item.femaleLedStartups / item.totalStartups) * 100)}%`}
                  </td>
                  <td className="p-3 text-muted-foreground">{item.ruralParticipants} / {item.metroParticipants}</td>
                  <td className="p-3">
                    <Badge className="bg-accent/15 text-accent border-accent/30">{item.complianceRate}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "340ms" }}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Underserved-State Alerts</h2>
          <span className="text-xs text-muted-foreground">Coverage, jobs, gender, and compliance rule checks</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">State</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Severity</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Reason</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {underservedAlerts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-sm text-muted-foreground">No underserved state alerts for the selected filters.</td>
                </tr>
              )}
              {underservedAlerts.map((alert, index) => (
                <tr key={`${alert.state}-${alert.reason}-${index}`} className="border-b border-border/20 hover:bg-muted/30">
                  <td className="p-3 font-medium">{alert.state}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        alert.severity === "High"
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : alert.severity === "Medium"
                            ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                            : "bg-primary/15 text-primary border-primary/30"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{alert.reason}</td>
                  <td className="p-3 text-muted-foreground">{alert.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
