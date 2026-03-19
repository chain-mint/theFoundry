import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, GripVertical, ArrowUp, ArrowDown, Zap } from "lucide-react";
import { type BlueprintRole } from "@/data/mockData";

interface TeamRolesGridProps {
  roles: BlueprintRole[];
  blueprintType: "max" | "lean";
  onReorder: (roles: BlueprintRole[]) => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

export function TeamRolesGrid({
  roles,
  blueprintType,
  onReorder,
  onPrimaryAction,
  primaryActionLabel = "Lock Team",
}: TeamRolesGridProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...roles];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onReorder(next);
  };

  const moveDown = (i: number) => {
    if (i === roles.length - 1) return;
    const next = [...roles];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onReorder(next);
  };

  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...roles];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    onReorder(next);
    setDragIdx(i);
  };
  const handleDragEnd = () => setDragIdx(null);

  const totalEquity = roles.reduce((sum, r) => sum + parseInt(r.equityAsk), 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Team Blueprint
            <Badge className={blueprintType === "max" ? "bg-primary/15 text-primary border-primary/30 text-xs" : "bg-accent/15 text-accent border-accent/30 text-xs"}>
              {blueprintType === "max" ? "Max Growth" : "Lean Efficiency"}
            </Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Drag to reorder priority, or use arrows. Total equity: {totalEquity}%</p>
        </div>
        <Button onClick={onPrimaryAction} disabled={!onPrimaryAction}>
          <Lock className="h-4 w-4 mr-2" />
          {primaryActionLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {roles.map((role, i) => (
          <div
            key={role.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`glass rounded-lg p-4 flex items-center gap-4 transition-all hover:border-primary/30 cursor-grab active:cursor-grabbing animate-fade-in ${
              dragIdx === i ? "opacity-50 scale-[0.98]" : ""
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Drag Handle + Priority */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
            </div>

            {/* Role Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{role.title}</h3>
                <Badge variant="secondary" className="text-xs font-semibold text-accent">{role.equityAsk}</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>

            {/* Matched Talent */}
            {role.matchedTalent && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{role.matchedTalent.name}</p>
                  <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="font-semibold text-primary">{role.matchedTalent.matchScore}%</span>
                    <span>· {role.matchedTalent.cohort}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                  {role.matchedTalent.avatar}
                </div>
              </div>
            )}

            {/* Reorder Arrows */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="p-1 rounded hover:bg-muted/50 disabled:opacity-20 transition-colors"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => moveDown(i)}
                disabled={i === roles.length - 1}
                className="p-1 rounded hover:bg-muted/50 disabled:opacity-20 transition-colors"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
