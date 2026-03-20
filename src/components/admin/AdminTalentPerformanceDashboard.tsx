import { useMemo, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  graduatePipeline,
  talentPerformanceLeaderboard,
  trainingRoiData,
} from "@/data/mockData";
import {
  Users,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function AdminTalentPerformanceDashboard() {
  const { toast } = useToast();
  const [cohortFilter, setCohortFilter] = useState("all");
  const [exporting, setExporting] = useState<"pdf" | "csv" | null>(null);

  const cohorts = useMemo(
    () => ["all", ...Array.from(new Set(graduatePipeline.map((item) => item.cohort)))],
    [],
  );

  const filteredPipeline = useMemo(
    () =>
      graduatePipeline.filter((item) => {
        if (cohortFilter !== "all" && item.cohort !== cohortFilter) return false;
        return true;
      }),
    [cohortFilter],
  );

  const filteredLeaderboard = useMemo(
    () =>
      talentPerformanceLeaderboard.filter((item) => {
        if (cohortFilter !== "all" && item.cohort !== cohortFilter) return false;
        return true;
      }),
    [cohortFilter],
  );

  const summary = useMemo(() => {
    const retentionRate =
      filteredLeaderboard.length === 0
        ? 0
        : Math.round(
            filteredLeaderboard.reduce((sum, item) => sum + item.retentionScore, 0) /
              filteredLeaderboard.length,
          );
    const equityAlignment =
      filteredLeaderboard.length === 0
        ? 0
        : Math.round(
            filteredLeaderboard.reduce((sum, item) => sum + item.equityAlignment, 0) /
              filteredLeaderboard.length,
          );
    const founders = filteredPipeline.filter((item) => item.inStartup).length;
    const avgVested =
      filteredPipeline.length === 0
        ? 0
        : Number(
            (
              filteredPipeline.reduce((sum, item) => sum + item.equityVested, 0) /
              filteredPipeline.length
            ).toFixed(1),
          );

    return { retentionRate, equityAlignment, founders, avgVested };
  }, [filteredLeaderboard, filteredPipeline]);

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

  const downloadFunderBriefPdf = () => {
    if (filteredPipeline.length === 0) {
      toast({ title: "No data to export", description: "Adjust filters to include at least one fellow." });
      return;
    }
    setExporting("pdf");
    const lines = [
      "3MTT Board Funder Brief (Mock PDF)",
      "Audience: AfDB / AFD style partner reports",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Cohort Filter: ${cohortFilter === "all" ? "All Cohorts" : cohortFilter}`,
      `Retention Rate: ${summary.retentionRate}%`,
      `Equity Alignment Success: ${summary.equityAlignment}%`,
      `Founding Engineers in Startups: ${summary.founders}`,
      "",
      "Macro Insight:",
      "theFoundry is increasing 3MTT graduate transition into startup founding teams with sustained vesting activity.",
    ];

    triggerDownload(
      "3mtt-funder-brief-afdb-afd.pdf",
      lines.join("\n"),
      "application/pdf",
    );
    toast({ title: "Report Generated", description: "Mock funder brief exported successfully." });
    setExporting(null);
  };

  const downloadCsv = () => {
    if (filteredPipeline.length === 0) {
      toast({ title: "No data to export", description: "Adjust filters to include at least one fellow." });
      return;
    }
    setExporting("csv");
    const header = "Fellow,Cohort,Status,Startup,EquityVested,InStartup\n";
    const rows = filteredPipeline
      .map((item) =>
        [
          item.fellow,
          item.cohort,
          item.status,
          item.startup,
          `${item.equityVested}%`,
          item.inStartup ? "Yes" : "No",
        ].join(","),
      )
      .join("\n");

    triggerDownload("3mtt-graduate-pipeline.csv", `${header}${rows}\n`, "text/csv;charset=utf-8;");
    toast({ title: "CSV Export Ready", description: "Graduate pipeline CSV downloaded." });
    setExporting(null);
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">Talent Performance Overview</h1>
          <Badge className="bg-primary/15 text-primary border-primary/30">Macro View</Badge>
          <Badge className="bg-accent/15 text-accent border-accent/30">
            theFoundry Outcomes
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          High-level board analytics on retention, equity alignment, and graduate-to-founding-engineer outcomes.
        </p>
      </div>

      <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-56">
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
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadFunderBriefPdf}>
              {exporting === "pdf" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <FileText className="h-4 w-4 mr-1.5" />}
              Export Funder Brief (AfDB/AFD)
            </Button>
            <Button size="sm" onClick={downloadCsv}>
              {exporting === "csv" ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Retention Rate" value={`${summary.retentionRate}%`} icon={TrendingUp} delay={100} />
        <StatCard title="Equity Alignment Success" value={`${summary.equityAlignment}%`} icon={ShieldCheck} delay={200} />
        <StatCard title="Founding Engineers" value={summary.founders} subtitle="active in startups" icon={Users} delay={300} />
        <StatCard title="Avg Equity Vested" value={`${summary.avgVested}%`} subtitle="across graduate pipeline" icon={GraduationCap} delay={400} />
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Top-Performing Fellows (Leaderboard)</h2>
          <span className="text-xs text-muted-foreground">Board ranking by retention + equity alignment</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Rank</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Fellow</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Cohort</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Startup</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Retention</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Equity Alignment</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard
                .slice()
                .sort((a, b) => b.retentionScore + b.equityAlignment - (a.retentionScore + a.equityAlignment))
                .map((item, index) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="p-3 font-semibold text-primary">#{index + 1}</td>
                    <td className="p-3 font-medium">{item.fellow}</td>
                    <td className="p-3 text-muted-foreground">{item.cohort}</td>
                    <td className="p-3">{item.startup}</td>
                    <td className="p-3"><Badge variant="secondary" className="text-accent">{item.retentionScore}%</Badge></td>
                    <td className="p-3"><Badge className="bg-primary/15 text-primary border-primary/30">{item.equityAlignment}%</Badge></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "250ms" }}>
        <div className="p-4 border-b border-border/50">
          <h2 className="text-sm font-semibold">Graduate Pipeline</h2>
          <p className="text-xs text-muted-foreground mt-1">Matched status, equity vesting, and startup participation.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Fellow</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Cohort</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Startup</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Equity Vested</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">In Startup</th>
              </tr>
            </thead>
            <tbody>
              {filteredPipeline.map((item) => (
                <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                  <td className="p-3 font-medium">{item.fellow}</td>
                  <td className="p-3 text-muted-foreground">{item.cohort}</td>
                  <td className="p-3"><Badge variant="secondary">{item.status}</Badge></td>
                  <td className="p-3">{item.startup}</td>
                  <td className="p-3 font-semibold text-accent">{item.equityVested}%</td>
                  <td className="p-3">
                    <Badge className={item.inStartup ? "bg-accent/15 text-accent border-accent/30" : "bg-muted text-muted-foreground"}>
                      {item.inStartup ? "Yes" : "No"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="text-sm font-semibold mb-4">ROI on Training: Founding Engineer Conversion</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trainingRoiData}>
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
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="trained" fill="hsl(220, 10%, 46%)" name="Graduates Trained" radius={[4, 4, 0, 0]} />
              <Bar dataKey="foundingEngineers" fill="hsl(211, 100%, 52%)" name="Became Founding Engineers" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retainedAfter90Days" fill="hsl(160, 84%, 39%)" name="Retained After 90 Days" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
