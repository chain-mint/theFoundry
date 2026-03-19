import { LayoutDashboard, Users, Zap, BarChart3, UserCog, LogOut, Moon, Sun, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const baseNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Team Blueprint", url: "/team", icon: Users },
  { title: "Matches", url: "/matches", icon: Zap },
  { title: "Impact Reports", url: "/impact", icon: BarChart3 },
  { title: "Profile & Settings", url: "/settings", icon: UserCog },
];

const talentNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Matches", url: "/matches", icon: Zap },
  { title: "Team Blueprint", url: "/team", icon: Users },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Impact Reports", url: "/impact", icon: BarChart3 },
  { title: "My Profile", url: "/settings", icon: UserCog },
];

const founderNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Team Blueprint", url: "/team", icon: Users },
  { title: "Matches", url: "/matches", icon: Zap },
  { title: "Impact Reports", url: "/impact", icon: BarChart3 },
  { title: "Profile & Settings", url: "/settings", icon: UserCog },
];

const boiNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Team Blueprint", url: "/team", icon: Users },
  { title: "Matches", url: "/matches", icon: Zap },
  { title: "Reports", url: "/impact", icon: BarChart3 },
  { title: "Profile & Settings", url: "/settings", icon: UserCog },
];

const roleLabels: Record<string, string> = {
  talent: "3MTT Talent",
  founder: "iDICE Founder",
  "boi-officer": "iDICE Board / BOI",
  admin: "3MTT Admin",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  if (!user) return null;

  const navItems = user.role === "talent"
    ? talentNavItems
    : user.role === "founder"
      ? founderNavItems
      : user.role === "boi-officer"
        ? boiNavItems
        : baseNavItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <div className="px-3 py-4 mb-2">
              <h2 className="text-lg font-bold gradient-text">theFoundry</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{roleLabels[user.role]}</p>
            </div>
          )}
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
            </div>
          </div>
        )}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
