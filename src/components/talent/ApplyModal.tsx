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
import { Zap, Shield, Clock } from "lucide-react";

interface Opportunity {
  id: number;
  name: string;
  founder: string;
  stage: string;
  sector: string;
  equity: string;
  role: string;
  matchScore: number;
  description: string;
}

interface ApplyModalProps {
  opportunity: Opportunity | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApplyModal({ opportunity, open, onClose, onConfirm }: ApplyModalProps) {
  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Apply to {opportunity.name}
          </DialogTitle>
          <DialogDescription>
            Review the equity terms before submitting your application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium">{opportunity.role}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Founder</span>
            <span className="font-medium">{opportunity.founder}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Match Score</span>
            <div className="flex items-center gap-1 font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              {opportunity.matchScore}%
            </div>
          </div>

          {/* Equity Terms Box */}
          <div className="rounded-lg bg-muted/50 border border-border/50 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equity Terms</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-accent" />
                Equity Offered
              </span>
              <span className="text-lg font-bold text-accent">{opportunity.equity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Vesting Period
              </span>
              <span className="font-medium">24 months (6-month cliff)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stage</span>
              <Badge variant="secondary">{opportunity.stage}</Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            By applying, you express interest in joining as a Founding Engineer. Equity terms are subject to final agreement after the interview process.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm Application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
