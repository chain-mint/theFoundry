import { useAuth } from "@/context/AuthContext";
import TalentProfilePage from "@/pages/TalentProfilePage";
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

const roleLabels: Record<string, string> = {
  talent: "3MTT Talent",
  founder: "iDICE Founder",
  "boi-officer": "iDICE Board / BOI Officer",
  admin: "3MTT Board / Admin",
};

export default function SettingsPage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  if (user.role === "talent") return <TalentProfilePage />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your simulated profile</p>
      </div>
      <div className="glass rounded-lg p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-bold">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <Badge variant="secondary" className="mt-1">{roleLabels[user.role]}</Badge>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Email</p>
              <p className="mt-1">{user.name.toLowerCase().replace(" ", ".")}@demo.foundry.ng</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Status</p>
              <p className="mt-1">Active (Simulated)</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border/50">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Switch Persona</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Switch Persona?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will leave this role dashboard and return to the persona selector.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Confirm Switch</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
