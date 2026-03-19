import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Target, Lock } from "lucide-react";
import { founderMilestones, complianceChecks, type BlueprintRole } from "@/data/mockData";

interface LockTeamFlowProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamRoles: BlueprintRole[];
}

export function LockTeamFlow({ open, onClose, onConfirm, teamRoles }: LockTeamFlowProps) {
  const totalEquity = teamRoles.reduce((sum, r) => sum + parseInt(r.equityAsk), 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass border-border/50 sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Lock Team & Proceed
          </DialogTitle>
          <DialogDescription>
            Review milestone alignment and compliance before locking your team architecture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Team Summary */}
          <div className="rounded-lg bg-muted/50 border border-border/50 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Team Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Members</span>
                <p className="font-semibold">{teamRoles.length} Founding Engineers</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Total Equity</span>
                <p className="font-semibold text-accent">{totalEquity}%</p>
              </div>
            </div>
          </div>

          {/* Milestone Alignment */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              iDICE Milestone Alignment
            </h4>
            <div className="space-y-2">
              {founderMilestones.map((ms) => (
                <div key={ms.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    ms.status === "complete" ? "bg-accent/15 text-accent" : ms.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {ms.status === "complete" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${ms.status === "active" ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${ms.status === "pending" ? "text-muted-foreground" : ""}`}>{ms.name}</p>
                    <p className="text-xs text-muted-foreground">{ms.desc}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {ms.status === "complete" ? "Done" : ms.status === "active" ? "Active" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Check */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Compliance Check
            </h4>
            <div className="space-y-2">
              {complianceChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${check.passed ? "text-accent" : "text-destructive"}`} />
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Go Back</Button>
          <Button onClick={onConfirm}>
            <Lock className="h-4 w-4 mr-2" />
            Confirm & Proceed to iDICE Milestone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
