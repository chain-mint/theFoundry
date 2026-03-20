import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, TrendingDown, ArrowRight } from "lucide-react";

interface BlueprintSelectorProps {
  idea: string;
  onSelect: (type: "max" | "lean") => void;
}

export function BlueprintSelector({ idea, onSelect }: BlueprintSelectorProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass rounded-lg p-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Your Startup Idea</h3>
        <p className="text-sm leading-relaxed">{idea}</p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Smart Blueprint Generated</h2>
      </div>
      <p className="text-sm text-muted-foreground -mt-2 mb-4">Choose a team architecture that fits your startup stage and growth strategy.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Max Growth */}
        <div className="glass rounded-lg p-6 border-2 border-transparent hover:border-primary/40 transition-all cursor-pointer group" onClick={() => onSelect("max")}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Max Growth Team</h3>
              <p className="text-xs text-muted-foreground">5–6 specialized roles</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Full-stack team with dedicated specialists. Best for startups targeting rapid scale, multiple product lines, or complex tech stacks.
          </p>
          <div className="space-y-2 mb-5">
            {["Lead Fullstack Engineer", "ML / Data Engineer", "UI/UX Design Lead", "DevOps / Infra", "Mobile Developer", "Growth Analyst"].map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Total Equity: ~39%</Badge>
            <Button size="sm" className="group-hover:glow-primary">
              Select <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Lean Efficiency */}
        <div className="glass rounded-lg p-6 border-2 border-transparent hover:border-accent/40 transition-all cursor-pointer group" onClick={() => onSelect("lean")}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <TrendingDown className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lean Efficiency Team</h3>
              <p className="text-xs text-muted-foreground">2–3 multi-role fellows</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Compact team of versatile engineers who cover multiple domains. Best for early-stage validation, tight budgets, and rapid iteration.
          </p>
          <div className="space-y-2 mb-5">
            {["Fullstack + DevOps Engineer", "ML + Data Analyst", "Design + Mobile Engineer"].map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Total Equity: ~27%</Badge>
            <Button size="sm" variant="outline" className="group-hover:border-accent/50">
              Select <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
