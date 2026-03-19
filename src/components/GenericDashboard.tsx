import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/StatCard";
import { impactStats, monthlyData } from "@/data/mockData";
import { Users, Zap, Building2, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const roleGreetings: Record<string, string> = {
  founder: "Welcome back — manage your team and track startup milestones.",
  "boi-officer": "Platform oversight — monitor startups and approve milestones.",
  admin: "Admin panel — cohort analytics and platform-wide impact.",
};

export default function GenericDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">{roleGreetings[user.role]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Matches" value={impactStats.totalMatches.toLocaleString()} icon={Zap} trend="+12% this month" delay={100} />
        <StatCard title="Active Startups" value={impactStats.activeStartups} icon={Building2} trend="+5 new" delay={200} />
        <StatCard title="Talents Placed" value={impactStats.talentsPlaced} icon={Users} trend="+8% growth" delay={300} />
        <StatCard title="Avg Match Score" value={`${impactStats.avgMatchScore}%`} icon={TrendingUp} delay={400} />
        <StatCard title="Equity Distributed" value={impactStats.equityDistributed} icon={DollarSign} delay={500} />
        <StatCard title="Jobs Created" value={impactStats.jobsCreated.toLocaleString()} icon={Briefcase} trend="+340 this quarter" delay={600} />
      </div>

      <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="text-sm font-semibold mb-4">Monthly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(211, 100%, 52%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(211, 100%, 52%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 25%, 11%)",
                  border: "1px solid hsl(222, 20%, 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="matches" stroke="hsl(211, 100%, 52%)" fill="url(#colorMatches)" strokeWidth={2} />
              <Area type="monotone" dataKey="placements" stroke="hsl(160, 84%, 39%)" fill="url(#colorPlacements)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
