import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PartyPopper, ArrowRight, RotateCcw, Zap } from "lucide-react";
import { type BlueprintRole } from "@/data/mockData";
import { BurnReductionChart } from "@/components/founder/BurnReductionChart";
import { DocumentSigningPanel } from "@/components/founder/DocumentSigningPanel";

interface FounderSuccessScreenProps {
  teamRoles: BlueprintRole[];
  founderName: string;
  finalizedProjectId: string | null;
  onReset: () => void;
}

export function FounderSuccessScreen({ teamRoles, founderName, finalizedProjectId, onReset }: FounderSuccessScreenProps) {
  const totalEquity = teamRoles.reduce((sum, r) => sum + parseInt(r.equityAsk), 0);

  return (
    <div className="space-y-8">
      {/* Success Hero */}
      <div className="glass rounded-xl p-8 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-accent/10 animate-pulse-glow">
              <PartyPopper className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Team Architecture Complete! 🎉
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your founding team is locked and ready for the <span className="font-semibold text-accent">₦10M iDICE grant track</span>. All compliance checks passed.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge className="bg-accent/15 text-accent border-accent/30 px-3 py-1 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              NSA 2026 Compliant
            </Badge>
            <Badge className="bg-primary/15 text-primary border-primary/30 px-3 py-1 text-sm">
              {teamRoles.length} Founding Engineers
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {totalEquity}% Total Equity
            </Badge>
          </div>
        </div>
      </div>

      {/* Locked Team */}
      <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="text-sm font-semibold mb-4">Your Founding Team</h2>
        <div className="space-y-3">
          {teamRoles.map((role, i) => (
            <div key={role.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 animate-fade-in" style={{ animationDelay: `${300 + i * 60}ms` }}>
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {role.matchedTalent?.avatar || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{role.matchedTalent?.name || "Unmatched"}</p>
                  <span className="text-xs text-muted-foreground">as</span>
                  <p className="text-sm text-muted-foreground truncate">{role.title}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 text-xs">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="font-semibold text-primary">{role.matchedTalent?.matchScore}%</span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold text-accent">{role.equityAsk}</Badge>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Burn Reduction */}
      <BurnReductionChart />

      {/* Signing */}
      <DocumentSigningPanel founderName={founderName} teamRoles={teamRoles} finalizedProjectId={finalizedProjectId} />

      {/* Next Steps */}
      <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="text-sm font-semibold mb-3">Next Steps</h2>
        <div className="space-y-2.5">
          {[
            "Begin MVP development sprint with your founding team",
            "Schedule kickoff meeting with iDICE milestone advisor",
            "Submit grant application for ₦10M iDICE funding track",
            "Set up equity vesting smart contracts via theFoundry",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm">
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pb-4">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Start New Blueprint
        </Button>
      </div>
    </div>
  );
}
