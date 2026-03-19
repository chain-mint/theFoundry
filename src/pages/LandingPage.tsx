import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, PersonaRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Rocket, Shield, Settings, Loader2, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const personas: {
  role: PersonaRole;
  label: string;
  desc: string;
  icon: typeof GraduationCap;
  accent: string;
}[] = [
  { role: "talent", label: "3MTT Talent", desc: "Browse matches, apply to startups, track your journey", icon: GraduationCap, accent: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { role: "founder", label: "iDICE Founder", desc: "Build your team, review talent matches, manage equity", icon: Rocket, accent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { role: "boi-officer", label: "iDICE Board / BOI", desc: "Monitor startups, review impact metrics, approve matches", icon: Shield, accent: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { role: "admin", label: "3MTT Board / Admin", desc: "Platform oversight, cohort management, system health", icon: Settings, accent: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
];

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [loadingRole, setLoadingRole] = useState<PersonaRole | null>(null);

  const handleSelect = (role: PersonaRole) => {
    setLoadingRole(role);
    login(role);
    setTimeout(() => navigate("/dashboard"), 350);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 dark:bg-[#070d1b]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(25,56,130,0.28),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(25,56,130,0.48),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(6,24,60,0.07),rgba(14,165,233,0.06)_50%,rgba(16,185,129,0.06))] dark:bg-[linear-gradient(110deg,rgba(3,10,28,0.75),rgba(14,165,233,0.08)_50%,rgba(16,185,129,0.08))]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-4 md:px-8 py-6">
        <header className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-2xl font-bold gradient-text">theFoundry</span>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] tracking-widest uppercase border border-border/50 text-muted-foreground bg-card/40 backdrop-blur">
              Experience Simulator
            </span>
          </div>
          <Button size="icon" variant="outline" onClick={toggle} className="bg-card/50 backdrop-blur border-border/60">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight text-foreground">
                <span className="gradient-text">AI-Driven</span> Matchmaking
              </h1>
              <p className="text-lg md:text-3xl text-muted-foreground mt-4 max-w-3xl mx-auto leading-relaxed">
                Connecting iDICE founders with 3MTT talents through intelligent matching. Select your persona to explore the platform.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
              {personas.map((p, i) => (
                <Button
                  key={p.role}
                  variant="persona"
                  className="h-auto min-h-[168px] py-6 px-6 flex flex-col items-start gap-3 text-left whitespace-normal animate-fade-in hover:scale-[1.02] dark:bg-[#0f1a31]/80 dark:border-[#213256] dark:hover:border-primary/50"
                  style={{ animationDelay: `${220 + i * 80}ms` }}
                  onClick={() => handleSelect(p.role)}
                  disabled={loadingRole !== null}
                >
                  <div className={`p-2.5 rounded-xl border ${p.accent}`}>
                    {loadingRole === p.role ? <Loader2 className="h-5 w-5 animate-spin" /> : <p.icon className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <p className="font-semibold text-2xl md:text-[38px] leading-tight text-foreground break-words">{p.label}</p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">{p.desc}</p>
                  </div>
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-12 animate-fade-in" style={{ animationDelay: "700ms" }}>
              This is a simulation demo - no real data is used.
            </p>
          </div>
        </main>

        <footer className="w-full max-w-6xl mx-auto text-center pb-1">
          <p className="text-xs text-muted-foreground/90">theFoundry Simulation - Demo Only</p>
        </footer>
      </div>
    </div>
  );
}
