import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { talentProfile } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, X, TrendingUp, Clock, Shield } from "lucide-react";

export default function TalentProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState(talentProfile.skills);
  const [newSkill, setNewSkill] = useState("");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(talentProfile.bio);

  if (!user || user.role !== "talent") return null;

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill("");
      toast({ title: "Skill Added", description: `"${s}" has been added to your profile.` });
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const vestPercent = (talentProfile.vestingMonths / talentProfile.vestingTotalMonths) * 100;
  const equityPercent = (talentProfile.equityVested / talentProfile.equityTotal) * 100;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage skills and track your equity journey</p>
      </div>

      {/* Profile Header */}
      <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-bold">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{talentProfile.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{talentProfile.cohort}</Badge>
              <Badge className="bg-accent/15 text-accent border-accent/30 text-xs">Founding Engineer</Badge>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {editing ? (
            <div className="space-y-2">
              <textarea
                className="w-full min-h-[80px] rounded-md bg-muted/50 border border-border/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { setEditing(false); toast({ title: "Bio Updated" }); }}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{bio}</p>
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-sm font-semibold mb-3">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs pl-2.5 pr-1 py-1 flex items-center gap-1.5">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-0.5 h-4 w-4 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className="max-w-xs bg-muted/50"
          />
          <Button size="sm" variant="outline" onClick={addSkill} disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Equity Tracker */}
      <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          Equity Tracker
        </h3>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-accent" />
                Equity Vested
              </span>
              <span className="font-semibold">{talentProfile.equityVested}% <span className="text-muted-foreground font-normal">of {talentProfile.equityTotal}%</span></span>
            </div>
            <Progress value={equityPercent} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1.5">
              {talentProfile.equityVested}% vested so far — {(talentProfile.equityTotal - talentProfile.equityVested).toFixed(1)}% remaining
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Vesting Timeline
              </span>
              <span className="font-semibold">{talentProfile.vestingMonths} <span className="text-muted-foreground font-normal">of {talentProfile.vestingTotalMonths} months</span></span>
            </div>
            <Progress value={vestPercent} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1.5">
              {talentProfile.vestingTotalMonths - talentProfile.vestingMonths} months remaining until fully vested
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
