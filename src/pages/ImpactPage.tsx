import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { impactStats, sectorDistribution, monthlyData, boiPortfolioOverview } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Users, Building2, DollarSign, Download, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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
    () => ["all", ...Array.from(new Set(boiPortfolioOverview.map((item) => item.state)))],
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
      "iDICE / BOI Oversight Impact Report (Mock PDF)",
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
    toast({ title: "Mock PDF Generated", description: "BOI oversight report exported." });
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
                  Download Mock PDF
                </Button>
                <Button size="sm" onClick={downloadCsv}>
                  {exporting === "csv" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
                  Download CSV
                </Button>
              </div>
            </div>
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
