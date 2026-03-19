import { burnReductionData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown } from "lucide-react";

export function BurnReductionChart() {
  return (
    <div className="glass rounded-lg p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-accent" />
          Burn Rate Comparison
        </h2>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold text-accent text-lg">40%</span>
          <span className="text-muted-foreground">burn reduction</span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={burnReductionData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 25%, 11%)",
                border: "1px solid hsl(222, 20%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [`₦${(value / 1000000).toFixed(1)}M`, name === "traditional" ? "Traditional Hiring" : "theFoundry Model"]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value: string) => value === "traditional" ? "Traditional Hiring" : "theFoundry Model"}
            />
            <Bar dataKey="traditional" fill="hsl(0, 60%, 50%)" radius={[3, 3, 0, 0]} opacity={0.6} />
            <Bar dataKey="foundry" fill="hsl(160, 84%, 39%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">6-Month Traditional</p>
          <p className="text-sm font-bold">₦31.2M</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">6-Month Foundry</p>
          <p className="text-sm font-bold text-accent">₦18.1M</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="text-sm font-bold text-accent">₦13.1M</p>
        </div>
      </div>
    </div>
  );
}
