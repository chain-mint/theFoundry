import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Users, TrendingDown, Target, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TeamRolesGrid } from "@/components/founder/TeamRolesGrid";
import { LockTeamFlow } from "@/components/founder/LockTeamFlow";
import { FounderSuccessScreen } from "@/components/founder/FounderSuccessScreen";
import { BurnReductionChart } from "@/components/founder/BurnReductionChart";
import { talents, type BlueprintRole } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  buildPendingResponsesForLockedTeam,
  finalizeFounderFlowProject,
  getBlueprintRolesForStrategy,
  replaceTalentForRole,
  simulateTalentResponseStates,
  simulateTeamArchitectureGeneration,
} from "@/lib/founderFlowSimulationService";
import { cn } from "@/lib/utils";

type FlowTab =
  | "problem"
  | "industry"
  | "stage"
  | "strategy"
  | "blueprint"
  | "talent"
  | "meet"
  | "finalize";

type StartupStage = "idea" | "prototype" | "mvp" | "growth";
type TeamStrategy = "growth_team" | "lean_team";
type RoleResponse = "pending" | "accepted" | "rejected";

type Candidate = {
  id: string;
  name: string;
  skills: string[];
  matchScore: number;
  cohort: string;
  avatar: string;
};

const TAB_ORDER: FlowTab[] = [
  "problem",
  "industry",
  "stage",
  "strategy",
  "blueprint",
  "talent",
  "meet",
  "finalize",
];

const STALE_TEMPLATE: Record<FlowTab, boolean> = {
  problem: false,
  industry: false,
  stage: false,
  strategy: false,
  blueprint: false,
  talent: false,
  meet: false,
  finalize: false,
};

const INDUSTRY_OPTIONS = [
  "FinTech",
  "AgriTech",
  "HealthTech",
  "EdTech",
  "CleanTech",
  "LogiTech",
  "AI/ML",
  "Other",
];

const TAB_META: Record<FlowTab, { title: string; hint: string }> = {
  problem: { title: "Problem", hint: "Define pain + solution" },
  industry: { title: "Industry", hint: "Pick sector or custom" },
  stage: { title: "Stage", hint: "Choose maturity level" },
  strategy: { title: "Strategy", hint: "Growth vs lean mode" },
  blueprint: { title: "Blueprint", hint: "Customize team roles" },
  talent: { title: "Talent", hint: "Swap and inspect matches" },
  meet: { title: "Meet", hint: "Lock and handle replies" },
  finalize: { title: "Finalize", hint: "Review and complete" },
};

export default function FounderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<FlowTab>("problem");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [startupStage, setStartupStage] = useState<StartupStage | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<TeamStrategy | null>(null);
  const [teamRoles, setTeamRoles] = useState<BlueprintRole[]>([]);
  const [blueprintSaved, setBlueprintSaved] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [teamLocked, setTeamLocked] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState<string | null>(null);
  const [finalizedProjectId, setFinalizedProjectId] = useState<string | null>(null);
  const [roleResponses, setRoleResponses] = useState<Record<string, RoleResponse>>({});
  const [rejectedPairs, setRejectedPairs] = useState<Set<string>>(new Set());
  const [selectedTalentProfile, setSelectedTalentProfile] = useState<Candidate | null>(null);
  const [staleTabs, setStaleTabs] = useState<Record<FlowTab, boolean>>(STALE_TEMPLATE);

  const isIdeaValid = problem.trim().length >= 20 && solution.trim().length >= 20;
  const isIndustryValid = !!industry && (industry !== "Other" || customIndustry.trim().length > 1);
  const isStageValid = !!startupStage;
  const isStrategyValid = !!strategy;
  const isBlueprintValid = teamRoles.length > 0 && blueprintSaved;
  const isTalentValid = teamRoles.every((role) => !!role.matchedTalent);
  const isMeetValid = teamLocked;

  const tabCompletion: Record<FlowTab, boolean> = {
    problem: isIdeaValid,
    industry: isIndustryValid,
    stage: isStageValid,
    strategy: isStrategyValid,
    blueprint: isBlueprintValid,
    talent: isTalentValid,
    meet: isMeetValid,
    finalize: finalized,
  };

  const candidatePool: Candidate[] = useMemo(() => {
    const fromTalents = talents.map((talent) => ({
      id: `talent-${talent.id}`,
      name: talent.name,
      skills: talent.skills,
      matchScore: talent.matchScore,
      cohort: talent.cohort,
      avatar: talent.name
        .split(" ")
        .map((token) => token[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    }));

    const fromAssigned = teamRoles
      .filter((role) => role.matchedTalent)
      .map((role) => {
        const matched = role.matchedTalent!;
        return {
          id: `assigned-${role.id}-${matched.name}`,
          name: matched.name,
          skills: role.skills,
          matchScore: matched.matchScore,
          cohort: matched.cohort,
          avatar: matched.avatar,
        };
      });

    const dedup = new Map<string, Candidate>();
    [...fromTalents, ...fromAssigned].forEach((candidate) => {
      if (!dedup.has(candidate.name)) {
        dedup.set(candidate.name, candidate);
      }
    });

    return Array.from(dedup.values());
  }, [teamRoles]);

  const clearDownstream = useCallback((from: FlowTab) => {
    const startIndex = TAB_ORDER.indexOf(from);
    const stale = { ...STALE_TEMPLATE };

    for (let i = startIndex + 1; i < TAB_ORDER.length; i += 1) {
      stale[TAB_ORDER[i]] = true;
    }

    setStaleTabs(stale);
    setStrategy(null);
    setTeamRoles([]);
    setBlueprintSaved(false);
    setTeamLocked(false);
    setFinalized(false);
    setFinalizedAt(null);
    setRoleResponses({});
    setSelectedTalentProfile(null);
  }, []);

  const generateArchitecture = useCallback(async () => {
    if (!isIdeaValid || !isIndustryValid || !isStageValid) {
      toast({
        title: "Complete all intake fields",
        description: "Add problem, solution, industry, and stage before generating architecture.",
      });
      return;
    }

    clearDownstream("stage");
    setIsGenerating(true);
    const normalizedIndustry = industry === "Other" ? customIndustry.trim() : industry;

    try {
      await simulateTeamArchitectureGeneration({
        problem,
        solution,
        industry: normalizedIndustry || "Unknown",
        stage: startupStage || "idea",
      });

      setIsGenerating(false);
      setStaleTabs((prev) => ({ ...prev, strategy: false }));
      setActiveTab("strategy");
    } catch {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: "Try again after reviewing your inputs.",
      });
    }
  }, [clearDownstream, customIndustry, industry, isIdeaValid, isIndustryValid, isStageValid, problem, solution, startupStage, toast]);

  const selectStrategy = useCallback(
    (nextStrategy: TeamStrategy) => {
      const cloned = getBlueprintRolesForStrategy(nextStrategy);

      setStrategy(nextStrategy);
      setTeamRoles(cloned);
      setBlueprintSaved(false);
      setTeamLocked(false);
      setFinalized(false);
      setFinalizedAt(null);
      setRoleResponses({});
      setStaleTabs((prev) => ({
        ...prev,
        strategy: false,
        blueprint: false,
        talent: false,
        meet: false,
        finalize: false,
      }));

      toast({
        title: nextStrategy === "growth_team" ? "Growth strategy selected" : "Lean strategy selected",
        description: "Blueprint generated. Customize roles and save to continue.",
      });
      setActiveTab("blueprint");
    },
    [toast],
  );

  const updateRole = useCallback((roleId: string, field: "title" | "skills", value: string) => {
    setTeamRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        if (field === "title") return { ...role, title: value };
        return { ...role, skills: value.split(",").map((item) => item.trim()).filter(Boolean) };
      }),
    );
    setBlueprintSaved(false);
  }, []);

  const addRole = useCallback(() => {
    setTeamRoles((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: "Custom Role",
        skills: ["React", "Node.js"],
        equityAsk: strategy === "growth_team" ? "5%" : "8%",
        matchedTalent: null,
      },
    ]);
    setBlueprintSaved(false);
  }, [strategy]);

  const removeRole = useCallback((roleId: string) => {
    setTeamRoles((prev) => prev.filter((role) => role.id !== roleId));
    setBlueprintSaved(false);
  }, []);

  const saveBlueprint = useCallback(() => {
    if (teamRoles.length === 0) {
      toast({ title: "Add at least one role", description: "Blueprint cannot be empty." });
      return;
    }

    setBlueprintSaved(true);
    setStaleTabs((prev) => ({ ...prev, blueprint: false }));
    toast({ title: "Blueprint saved", description: "You can now proceed to talent matching." });
    setActiveTab("talent");
  }, [teamRoles.length, toast]);

  const getRoleAlternatives = useCallback(
    (role: BlueprintRole) =>
      candidatePool
        .filter((candidate) => candidate.name !== role.matchedTalent?.name)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5),
    [candidatePool],
  );

  const replaceTalent = useCallback(
    (roleId: string, candidateName: string) => {
      const candidate = candidatePool.find((item) => item.name === candidateName);
      if (!candidate) return;

      setTeamRoles((prev) =>
        replaceTalentForRole({
          teamRoles: prev,
          roleId,
          candidate: {
            name: candidate.name,
            avatar: candidate.avatar,
            matchScore: candidate.matchScore,
            cohort: candidate.cohort,
          },
        }),
      );

      setRoleResponses((prev) => ({ ...prev, [roleId]: "pending" }));
      setTeamLocked(false);
      setFinalized(false);
      setFinalizedAt(null);
    },
    [candidatePool],
  );

  const simulateResponses = useCallback(() => {
    const simulated = simulateTalentResponseStates(teamRoles);
    setRoleResponses(simulated.responses);
    setRejectedPairs((prev) => {
      const merged = new Set(prev);
      simulated.rejectedPairs.forEach((pair) => merged.add(pair));
      return merged;
    });
    toast({
      title: "Responses simulated",
      description: "Rejected talent-role pairs are now blocked for this project.",
    });
  }, [teamRoles, toast]);

  const confirmLock = useCallback(() => {
    setShowLockDialog(false);
    setTeamLocked(true);

    setRoleResponses((prev) => buildPendingResponsesForLockedTeam(teamRoles, prev));

    toast({
      title: "Team locked",
      description: "Hire requests have been sent to selected talents (simulated).",
    });
  }, [teamRoles, toast]);

  const finalizeTeam = useCallback(() => {
    if (Object.values(roleResponses).includes("rejected")) {
      toast({
        title: "Resolve rejected talents first",
        description: "Replace rejected assignments in the Talent tab before finalizing.",
      });
      return;
    }

    const finalizedTimestamp = new Date().toLocaleString();
    const normalizedIndustry = industry === "Other" ? customIndustry.trim() : industry;
    const projectLabel = `${normalizedIndustry || "Startup"} ${startupStage ? startupStage.toUpperCase() : "PROJECT"}`;

    const { projectId } = finalizeFounderFlowProject({
      founderName: user.name,
      projectName: projectLabel,
      industry: normalizedIndustry || "Unknown",
      stage: startupStage || "idea",
      strategy: strategy || "lean_team",
      finalizedAt: finalizedTimestamp,
      teamRoles,
    });

    setFinalized(true);
    setFinalizedAt(finalizedTimestamp);
    setFinalizedProjectId(projectId);
    toast({
      title: "Team setup finalized",
      description: "Mock iDICE Board notification sent from frontend simulation.",
    });
  }, [customIndustry, industry, roleResponses, startupStage, strategy, teamRoles, toast, user.name]);

  const goPrevious = useCallback(() => {
    const index = TAB_ORDER.indexOf(activeTab);
    if (index > 0) setActiveTab(TAB_ORDER[index - 1]);
  }, [activeTab]);

  const goNext = useCallback(() => {
    const index = TAB_ORDER.indexOf(activeTab);
    if (index < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[index + 1]);
  }, [activeTab]);

  const resetAll = useCallback(() => {
    setActiveTab("problem");
    setProblem("");
    setSolution("");
    setIndustry("");
    setCustomIndustry("");
    setStartupStage("");
    setIsGenerating(false);
    setStrategy(null);
    setTeamRoles([]);
    setBlueprintSaved(false);
    setShowLockDialog(false);
    setTeamLocked(false);
    setFinalized(false);
    setFinalizedAt(null);
    setFinalizedProjectId(null);
    setRoleResponses({});
    setRejectedPairs(new Set());
    setSelectedTalentProfile(null);
    setStaleTabs(STALE_TEMPLATE);
  }, []);

  if (!user) return null;

  if (finalized) {
    return (
      <FounderSuccessScreen
        teamRoles={teamRoles}
        founderName={user.name}
        finalizedProjectId={finalizedProjectId}
        onReset={resetAll}
      />
    );
  }

  const boardStatus = teamLocked ? "Ready to Finalize" : "In Progress";
  const gridType = strategy === "growth_team" ? "max" : "lean";
  const completedStepCount = TAB_ORDER.filter((step) => tabCompletion[step]).length;
  const activeStepNumber = TAB_ORDER.indexOf(activeTab) + 1;
  const progressPercent = Math.round((completedStepCount / TAB_ORDER.length) * 100);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name.split(" ")[0]}</h1>
          <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">iDICE Founder</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Build your team architecture step-by-step. You can jump back and edit any earlier decision at any time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Blueprint Status" value={strategy ? "Generated" : "Not Started"} icon={Rocket} delay={100} />
        <StatCard title="Team Members" value={teamRoles.length} subtitle={strategy ? (strategy === "growth_team" ? "Growth mode" : "Lean mode") : "Select strategy"} icon={Users} delay={200} />
        <StatCard title="Burn Reduction" value="40%" subtitle="vs. traditional hiring" icon={TrendingDown} trend="N3.2M saved" delay={300} />
        <StatCard title="Board Status" value={boardStatus} subtitle={finalizedAt || "No finalization yet"} icon={Target} delay={400} />
      </div>

      <div className="glass rounded-xl overflow-hidden border border-primary/20 animate-fade-in">
        <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">Founder Team Formation</p>
              <h2 className="text-lg font-semibold">Step {activeStepNumber} of {TAB_ORDER.length}: {TAB_META[activeTab].title}</h2>
            </div>
            <Badge variant="secondary" className="text-xs">{progressPercent}% complete</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{TAB_META[activeTab].hint}</p>
          <div className="mt-4 h-2 rounded-full bg-background/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FlowTab)}>
        <div className="glass rounded-lg p-3 md:p-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-transparent p-0 h-auto w-max gap-2">
              {TAB_ORDER.map((tab, index) => {
                const isComplete = tabCompletion[tab];
                const isStale = staleTabs[tab];
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={cn(
                      "h-auto min-w-[148px] md:min-w-[160px] rounded-lg border px-3 py-2.5 data-[state=active]:shadow-none",
                      "data-[state=active]:bg-primary/10 data-[state=active]:text-foreground data-[state=active]:border-primary/40",
                      isComplete && "border-accent/40",
                      isStale && "border-destructive/30",
                    )}
                  >
                    <div className="w-full flex items-center gap-2">
                      <div className={cn(
                        "h-5 w-5 rounded-full text-[10px] font-semibold flex items-center justify-center",
                        isComplete ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
                      )}>
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold">{TAB_META[tab].title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {isComplete ? "Complete" : isStale ? "Needs refresh" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        <TabsContent value="problem" className="glass rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tab 1: Problem and Solution</h2>
          </div>
          <textarea
            className="w-full min-h-[140px] rounded-lg bg-muted/40 border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 resize-none"
            placeholder="Describe the problem your startup is solving..."
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              clearDownstream("problem");
            }}
          />
          <textarea
            className="w-full min-h-[140px] rounded-lg bg-muted/40 border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 resize-none mt-3"
            placeholder="Describe your solution approach..."
            value={solution}
            onChange={(e) => {
              setSolution(e.target.value);
              clearDownstream("problem");
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">Minimum 20 characters each for problem and solution.</p>
        </TabsContent>

        <TabsContent value="industry" className="glass rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-3">Tab 2: Industry Selection</h2>
          <Select
            value={industry}
            onValueChange={(value) => {
              setIndustry(value);
              if (value !== "Other") setCustomIndustry("");
              clearDownstream("industry");
            }}
          >
            <SelectTrigger className="bg-muted/40">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {industry === "Other" && (
            <input
              className="mt-3 w-full rounded-lg bg-muted/40 border border-border/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40"
              placeholder="Type custom industry"
              value={customIndustry}
              onChange={(e) => {
                setCustomIndustry(e.target.value);
                clearDownstream("industry");
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="stage" className="glass rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Tab 3: Stage and Generate</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {[
              { key: "idea", label: "Idea" },
              { key: "prototype", label: "Prototype" },
              { key: "mvp", label: "MVP" },
              { key: "growth", label: "Growth" },
            ].map((item) => (
              <button
                key={item.key}
                className={`rounded-lg border p-3 text-sm transition-colors ${startupStage === item.key ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/40"}`}
                onClick={() => {
                  setStartupStage(item.key as StartupStage);
                  clearDownstream("stage");
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button onClick={generateArchitecture} disabled={isGenerating || !isIdeaValid || !isIndustryValid || !isStageValid} className="min-w-[230px]">
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {isGenerating ? "Generating..." : "Generate Team Architecture"}
          </Button>
        </TabsContent>

        <TabsContent value="strategy" className="glass rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Tab 4: Team Strategy</h2>
          <p className="text-sm text-muted-foreground mb-4">Choose strategy before role customization.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className={cn(
                "text-left rounded-lg border p-4 transition-all",
                "hover:border-primary/40 hover:bg-primary/5",
                strategy === "growth_team" ? "border-primary/50 bg-primary/10" : "border-border/50",
              )}
              onClick={() => selectStrategy("growth_team")}
            >
              <h3 className="font-semibold">Growth Team</h3>
              <p className="text-xs text-muted-foreground mt-1">Up to 6 specialist roles.</p>
            </button>
            <button
              className={cn(
                "text-left rounded-lg border p-4 transition-all",
                "hover:border-accent/40 hover:bg-accent/5",
                strategy === "lean_team" ? "border-accent/50 bg-accent/10" : "border-border/50",
              )}
              onClick={() => selectStrategy("lean_team")}
            >
              <h3 className="font-semibold">Lean Team</h3>
              <p className="text-xs text-muted-foreground mt-1">2-3 multi-role engineers.</p>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="blueprint" className="space-y-4">
          {!strategy && (
            <div className="glass rounded-lg p-5 border border-dashed border-border/60">
              <p className="text-sm font-medium">Select a strategy first</p>
              <p className="text-xs text-muted-foreground mt-1">Go to Tab 4 to choose Growth Team or Lean Team before editing blueprint roles.</p>
            </div>
          )}
          <div className="glass rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Tab 5: Blueprint Roles</h2>
            <p className="text-sm text-muted-foreground mb-4">Customize roles, then save blueprint.</p>

            <div className="space-y-3 mb-4">
              {teamRoles.map((role) => (
                <div key={role.id} className="rounded-lg border border-border/50 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      className="rounded-md bg-muted/40 border border-border/50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={role.title}
                      onChange={(e) => updateRole(role.id, "title", e.target.value)}
                    />
                    <input
                      className="rounded-md bg-muted/40 border border-border/50 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      value={role.skills.join(", ")}
                      onChange={(e) => updateRole(role.id, "skills", e.target.value)}
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => removeRole(role.id)}>
                      Remove Role
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={addRole}>Add Role</Button>
              <Button onClick={saveBlueprint} disabled={teamRoles.length === 0}>Save Blueprint</Button>
            </div>
          </div>

          {teamRoles.length > 0 && strategy && (
            <TeamRolesGrid
              roles={teamRoles}
              blueprintType={gridType}
              onReorder={(roles) => {
                setTeamRoles(roles);
                setBlueprintSaved(false);
              }}
              onPrimaryAction={saveBlueprint}
              primaryActionLabel="Save Blueprint"
            />
          )}
          <BurnReductionChart />
        </TabsContent>

        <TabsContent value="talent" className="glass rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Tab 6: Talent Matching</h2>
          {!blueprintSaved && (
            <div className="mb-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-medium">Save your blueprint to continue</p>
              <p className="text-xs text-muted-foreground mt-1">Talent matching works from the saved role architecture in Tab 5.</p>
            </div>
          )}
          <div className="space-y-4">
            {teamRoles.map((role) => (
              <div key={role.id} className="rounded-lg border border-border/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{role.title}</p>
                    <p className="text-xs text-muted-foreground">{role.skills.join(" · ")}</p>
                  </div>
                  <Badge variant="secondary">{role.equityAsk}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Assigned:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const selected = candidatePool.find((candidate) => candidate.name === role.matchedTalent?.name) || null;
                      setSelectedTalentProfile(selected);
                    }}
                  >
                    {role.matchedTalent?.name || "Unassigned"}
                  </Button>

                  <Select onValueChange={(value) => replaceTalent(role.id, value)}>
                    <SelectTrigger className="w-full sm:w-[280px]">
                      <SelectValue placeholder="Replace with another talent" />
                    </SelectTrigger>
                    <SelectContent>
                      {getRoleAlternatives(role).map((candidate) => {
                        const blockedKey = `${role.id}:${candidate.name}`;
                        const blocked = rejectedPairs.has(blockedKey);
                        return (
                          <SelectItem key={`${role.id}-${candidate.name}`} value={candidate.name} disabled={blocked}>
                            {candidate.name} ({candidate.matchScore}%) {blocked ? "- Rejected for this project" : ""}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {selectedTalentProfile && (
            <div className="mt-5 rounded-lg border border-border/50 bg-muted/30 p-4">
              <h3 className="text-sm font-semibold mb-2">Talent Profile (Sidebar Preview)</h3>
              <p className="text-sm font-medium">{selectedTalentProfile.name}</p>
              <p className="text-xs text-muted-foreground">{selectedTalentProfile.cohort}</p>
              <p className="text-xs text-muted-foreground mt-2">Skills: {selectedTalentProfile.skills.join(", ")}</p>
              <p className="text-xs text-primary mt-1">Match score: {selectedTalentProfile.matchScore}%</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="meet" className="glass rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Tab 7: Meet and Lock</h2>
          {!isTalentValid && (
            <div className="mb-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-medium">Assign talents to all roles first</p>
              <p className="text-xs text-muted-foreground mt-1">Complete assignments in Tab 6 before locking team and sending requests.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => setShowLockDialog(true)} disabled={!isTalentValid}>
              Lock Team and Notify Talents
            </Button>
            <Button variant="outline" onClick={simulateResponses} disabled={!teamLocked}>
              Simulate Responses
            </Button>
          </div>

          <div className="space-y-2">
            {teamRoles.map((role) => {
              const response = roleResponses[role.id] || "pending";
              const accepted = response === "accepted";

              return (
                <div key={role.id} className="rounded-lg border border-border/50 p-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{role.title}</p>
                    <p className="text-xs text-muted-foreground">{role.matchedTalent?.name || "No talent assigned"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={response === "accepted" ? "default" : response === "rejected" ? "destructive" : "secondary"}>
                      {response}
                    </Badge>
                    <Button size="sm" variant="outline" disabled={!accepted}>Start Chat</Button>
                    <Button size="sm" variant="outline" disabled={!accepted}>Schedule Call</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="finalize" className="glass rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Tab 8: Finalize and Save</h2>
          {!teamLocked && (
            <div className="mb-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-medium">Lock team before finalization</p>
              <p className="text-xs text-muted-foreground mt-1">Use Tab 7 to lock the team and simulate responses first.</p>
            </div>
          )}
          <div className="rounded-lg border border-border/50 p-4 mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {teamLocked ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
              Team locked and requests sent
            </div>
            <div className="flex items-center gap-2 text-sm">
              {Object.values(roleResponses).includes("rejected") ? <AlertCircle className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-accent" />}
              No unresolved rejected assignments
            </div>
            <p className="text-xs text-muted-foreground">Frontend simulation only: finalization dispatches a mock iDICE Board notification.</p>
          </div>
          <Button onClick={finalizeTeam} disabled={!teamLocked || Object.values(roleResponses).includes("rejected")}>
            Finish Team Setup
          </Button>
        </TabsContent>
      </Tabs>

      <div className="glass rounded-lg p-4 flex items-center justify-between">
        <Button variant="outline" onClick={goPrevious} disabled={TAB_ORDER.indexOf(activeTab) === 0}>
          Previous
        </Button>
        <Button variant="outline" onClick={goNext} disabled={TAB_ORDER.indexOf(activeTab) === TAB_ORDER.length - 1}>
          Next
        </Button>
      </div>

      {showLockDialog && (
        <LockTeamFlow
          open={showLockDialog}
          onClose={() => setShowLockDialog(false)}
          onConfirm={confirmLock}
          teamRoles={teamRoles}
        />
      )}
    </div>
  );
}
