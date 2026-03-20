import { useMemo } from "react";
import { talents } from "@/data/mockData";
import { boiPortfolioOverview } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { fellowAvatarUrl } from "@/lib/visuals";
import { useAuth } from "@/context/AuthContext";
import { getTeamPageIntent } from "@/lib/roleNavigation";

export default function TeamPage() {
  const { user } = useAuth();
  const role = user?.role ?? "talent";
  const pageIntent = getTeamPageIntent(role);
  const isOversightRole = role === "boi-officer" || role === "admin";

  const oversightSummary = useMemo(() => {
    const trackedFounders = boiPortfolioOverview.length;
    const talentsPlaced = boiPortfolioOverview.reduce((sum, item) => sum + item.talentPlaced, 0);
    const complianceVerified = boiPortfolioOverview.filter((item) => item.compliance === "Verified").length;
    const grantsUnlocked = boiPortfolioOverview.filter((item) => item.grantStatus === "Unlocked").length;
    return { trackedFounders, talentsPlaced, complianceVerified, grantsUnlocked };
  }, []);

  const cohortSummary = useMemo(() => {
    const map = new Map<string, { startups: number; placements: number }>();
    boiPortfolioOverview.forEach((item) => {
      const existing = map.get(item.cohort) ?? { startups: 0, placements: 0 };
      map.set(item.cohort, {
        startups: existing.startups + 1,
        placements: existing.placements + item.talentPlaced,
      });
    });
    return Array.from(map.entries()).map(([cohort, values]) => ({ cohort, ...values }));
  }, []);

  if (!user) return null;

  if (isOversightRole) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold">{pageIntent.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{pageIntent.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Founders Tracked</p>
            <p className="text-2xl font-bold mt-1">{oversightSummary.trackedFounders}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Team Placements</p>
            <p className="text-2xl font-bold mt-1">{oversightSummary.talentsPlaced}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Grants Unlocked</p>
            <p className="text-2xl font-bold mt-1">{oversightSummary.grantsUnlocked}</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Compliance Verified</p>
            <p className="text-2xl font-bold mt-1">{oversightSummary.complianceVerified}/{oversightSummary.trackedFounders}</p>
          </div>
        </div>

        {user.role === "admin" && (
          <div className="glass rounded-lg p-4 animate-fade-in" style={{ animationDelay: "120ms" }}>
            <h2 className="text-sm font-semibold mb-3">Cohort Operations Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cohortSummary.map((item) => (
                <div key={item.cohort} className="rounded-md border border-border/50 bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{item.cohort}</p>
                  <p className="text-sm font-medium mt-1">{item.startups} startups</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.placements} placements</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="p-4 border-b border-border/50">
            <h2 className="text-sm font-semibold">
              {user.role === "boi-officer" ? "Portfolio Team Composition" : "Program Team Composition"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {user.role === "boi-officer"
                ? "Oversight-only view of team composition and grant readiness by founder."
                : "Operational view of startup team composition across cohorts."}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Founder</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Startup</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Cohort</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Team Type</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Talent Placed</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Grant</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {boiPortfolioOverview.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="p-3 font-medium">{item.founder}</td>
                    <td className="p-3">{item.startup}</td>
                    <td className="p-3 text-muted-foreground">{item.cohort}</td>
                    <td className="p-3 text-muted-foreground">{item.teamType}</td>
                    <td className="p-3">{item.talentPlaced}</td>
                    <td className="p-3">
                      <Badge variant={item.grantStatus === "Unlocked" ? "default" : "secondary"}>{item.grantStatus}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={item.compliance === "Verified" ? "default" : "outline"}>{item.compliance}</Badge>
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

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">{pageIntent.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pageIntent.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((t, i) => (
          <div
            key={t.id}
            className="glass rounded-lg p-5 animate-fade-in hover-scale cursor-pointer"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={fellowAvatarUrl(t.name)}
                alt={`${t.name} avatar`}
                className="w-10 h-10 rounded-full border border-border/50 object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.cohort}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {t.skills.map(s => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Match Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${t.matchScore}%` }} />
                </div>
                <span className="font-semibold">{t.matchScore}%</span>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={t.status === "Available" ? "default" : "secondary"} className="text-xs">
                {t.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
