import { talents } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { fellowAvatarUrl } from "@/lib/visuals";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Team Blueprint</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse available talent and build your ideal team</p>
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
