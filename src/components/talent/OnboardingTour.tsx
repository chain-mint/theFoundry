import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Users, TrendingUp, Zap, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Rocket,
    title: "Welcome to theFoundry!",
    description: "You're about to experience what it's like to be a Founding Engineer — a 3MTT talent matched with an iDICE startup via AI-driven matchmaking.",
  },
  {
    icon: Users,
    title: "Become a Founding Engineer",
    description: "As a Founding Engineer, you join early-stage startups with equity stakes. Your skills and goals are matched to startups that need exactly what you offer.",
  },
  {
    icon: TrendingUp,
    title: "Equity & Vesting",
    description: "When matched, you'll receive equity (typically 5-10%) with a vesting schedule. Track your vesting progress and milestones on your dashboard.",
  },
  {
    icon: Zap,
    title: "AI Matchmaking",
    description: "Our AI analyzes your skills, preferences, and career goals against startup needs. Browse opportunities, apply, and let the platform find your ideal fit.",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      setOpen(false);
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); onComplete(); } }}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 rounded-xl bg-primary/10 animate-pulse-glow">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{current.title}</DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            {current.description}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/50" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setOpen(false); onComplete(); }}
            className="text-muted-foreground"
          >
            Skip tour
          </Button>
          <Button onClick={handleNext} size="sm">
            {isLast ? "Get Started" : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
