import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/StatCard";
import { talentProfile, talentApplications, discoverOpportunities } from "@/data/mockData";
import { Zap, Briefcase, CalendarCheck, TrendingUp, Rocket, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplyModal } from "@/components/talent/ApplyModal";
import { useToast } from "@/hooks/use-toast";
import { startupIconLabel } from "@/lib/visuals";

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  "Under Review": "secondary",
  Interview: "outline",
  Offered: "default",
};

interface Opportunity {
  id: number;
  name: string;
  founder: string;
  stage: string;
  sector: string;
  equity: string;
  teamSize: number;
  milestone: string;
  matchScore: number;
  role: string;
  description: string;
}

export default function TalentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applyTarget, setApplyTarget] = useState<Opportunity | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  if (!user) return null;

  const handleApplyConfirm = () => {
    if (applyTarget) {
      setAppliedIds((prev) => new Set(prev).add(applyTarget.id));
      toast({
        title: "Application Submitted! 🎉",
        description: `Your application to ${applyTarget.name} as ${applyTarget.role} has been sent. Equity terms: ${applyTarget.equity}.`,
      });
      setApplyTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Status */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
          <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">Founding Engineer</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Your Founding Engineer Status — explore matches and track your equity journey.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Matches Received" value={talentProfile.matchesReceived} icon={Zap} trend="+2 new this week" delay={100} />
        <StatCard title="Active Applications" value={talentProfile.applicationsActive} icon={Send} delay={200} />
        <StatCard title="Interviews Scheduled" value={talentProfile.interviewsScheduled} icon={CalendarCheck} delay={300} />
        <StatCard title="Equity Vesting" value={`${talentProfile.equityVested}%`} subtitle={`of ${talentProfile.equityTotal}% total`} icon={TrendingUp} delay={400} />
      </div>

      {/* Current Applications Table */}
      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="p-5 pb-3 border-b border-border/50">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Your Applications
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Startup</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Stage</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Equity</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Milestone Fit</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {talentApplications.map((app) => (
                <tr key={app.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{app.startup}</td>
                  <td className="p-4 text-muted-foreground">{app.stage}</td>
                  <td className="p-4 text-muted-foreground">{app.role}</td>
                  <td className="p-4 font-semibold text-primary">{app.equity}</td>
                  <td className="p-4">
                    <Badge variant="secondary" className="text-xs">{app.milestonefit}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusBadgeVariant[app.status] || "secondary"}>{app.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discover Opportunities */}
      <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Discover Opportunities</h2>
          <span className="text-xs text-muted-foreground ml-1">AI-matched for your skills</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {discoverOpportunities.map((opp, i) => (
            <div
              key={opp.id}
              className="glass rounded-lg p-5 flex flex-col animate-fade-in"
              style={{ animationDelay: `${500 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                      {startupIconLabel(opp.sector)}
                    </span>
                    {opp.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{opp.founder} · {opp.sector}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  {opp.matchScore}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{opp.description}</p>
              <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                <div>
                  <span className="text-muted-foreground">Stage</span>
                  <p className="font-medium mt-0.5">{opp.stage}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Equity</span>
                  <p className="font-semibold text-accent mt-0.5">{opp.equity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Role</span>
                  <p className="font-medium mt-0.5 truncate">{opp.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">{opp.milestone}</Badge>
                {appliedIds.has(opp.id) ? (
                  <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">Applied ✓</Badge>
                ) : (
                  <Button size="sm" onClick={() => setApplyTarget(opp)}>
                    Apply
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      <ApplyModal
        opportunity={applyTarget}
        open={!!applyTarget}
        onClose={() => setApplyTarget(null)}
        onConfirm={handleApplyConfirm}
      />
    </div>
  );
}
