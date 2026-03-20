import { matchData } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const statusColors: Record<string, string> = {
  Pending: "secondary",
  Accepted: "default",
  Interview: "outline",
};

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">AI Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered matchmaking between talents and startups</p>
      </div>
      <div className="glass rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Talent</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Startup</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Score</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {matchData.map((m, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{m.talent}</td>
                  <td className="p-4">{m.startup}</td>
                  <td className="p-4 text-muted-foreground">{m.role}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span className="font-semibold">{m.score}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={statusColors[m.status] as any || "secondary"}>{m.status}</Badge>
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
