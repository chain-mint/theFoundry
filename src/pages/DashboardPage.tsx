import { useAuth } from "@/context/AuthContext";
import { OnboardingTour } from "@/components/talent/OnboardingTour";
import TalentDashboard from "@/pages/TalentDashboard";
import FounderDashboard from "@/pages/FounderDashboard";
import GenericDashboard from "@/components/GenericDashboard";
import BoiOversightDashboard from "@/components/boi/BoiOversightDashboard";
import AdminTalentPerformanceDashboard from "@/components/admin/AdminTalentPerformanceDashboard";

export default function DashboardPage() {
  const { user, hasSeenOnboarding, completeOnboarding } = useAuth();
  if (!user) return null;

  if (user.role === "talent") {
    return (
      <>
        {!hasSeenOnboarding && <OnboardingTour onComplete={completeOnboarding} />}
        <TalentDashboard />
      </>
    );
  }

  if (user.role === "founder") {
    return <FounderDashboard />;
  }

  if (user.role === "boi-officer") {
    return <BoiOversightDashboard />;
  }

  if (user.role === "admin") {
    return <AdminTalentPerformanceDashboard />;
  }

  return <GenericDashboard />;
}
