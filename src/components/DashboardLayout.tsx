import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { canAccessPath } from "@/lib/roleNavigation";

export function DashboardLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showTips, setShowTips] = useState(false);

  const tipText = useMemo(() => {
    if (!user) return "";
    if (user.role === "talent") return "Complete your profile, track equity vesting, and apply to AI-matched founders.";
    if (user.role === "founder") return "Generate your Smart Blueprint, lock team architecture, and align milestones for grant readiness.";
    if (user.role === "boi-officer") return "Use filters to monitor compliance and portfolio progression in real time.";
    return "Track macro talent outcomes, monitor ROI, and export funder-ready reports.";
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const key = `thefoundry:tours:${user.role}`;
    const hasSeen = window.localStorage.getItem(key) === "1";
    setShowTips(!hasSeen);
  }, [user]);

  const dismissTips = () => {
    if (!user) return;
    window.localStorage.setItem(`thefoundry:tours:${user.role}`, "1");
    setShowTips(false);
  };

  useEffect(() => {
    if (!user) return;
    if (canAccessPath(user.role, location.pathname)) return;

    toast({
      title: "Restricted route",
      description: "That page is not available for your current persona.",
    });
    navigate("/dashboard", { replace: true });
  }, [location.pathname, navigate, toast, user]);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user && !canAccessPath(user.role, location.pathname)) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 glass sticky top-0 z-10">
            <div className="flex items-center">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-semibold gradient-text">theFoundry</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  Logout / Switch Persona
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Switch Persona?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end the current simulated session and return you to persona selection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      logout();
                      toast({ title: "Session Ended", description: "You can now choose another persona." });
                    }}
                  >
                    Confirm Switch
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </header>

          {showTips && (
            <div className="mx-4 mt-4 glass rounded-lg p-3 border border-primary/20 animate-fade-in">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-sm text-muted-foreground truncate">{tipText}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-primary/15 text-primary border-primary/30">Onboarding Tip</Badge>
                  <Button size="sm" variant="ghost" onClick={dismissTips}>Dismiss</Button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
          <footer className="w-full max-w-6xl mx-auto text-center pb-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} theFoundry. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              AI-powered talent ↔ startup matching platform
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
