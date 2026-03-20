import { useState } from "react";
import { talentNotifications } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Zap, TrendingUp, Shield, Info, CheckCheck } from "lucide-react";

const typeIcons: Record<string, typeof Zap> = {
  match: Zap,
  update: TrendingUp,
  equity: Shield,
  milestone: TrendingUp,
  system: Info,
};

const typeColors: Record<string, string> = {
  match: "text-primary",
  update: "text-accent",
  equity: "text-accent",
  milestone: "text-primary",
  system: "text-muted-foreground",
};

export default function TalentNotificationsPage() {
  const [notifications, setNotifications] = useState(talentNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = typeIcons[n.type] || Info;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`glass rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-all hover:border-primary/30 animate-fade-in ${
                !n.read ? "border-primary/20 bg-primary/5" : ""
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`p-2 rounded-lg bg-muted/50 mt-0.5 ${typeColors[n.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${!n.read ? "font-medium" : "text-muted-foreground"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
