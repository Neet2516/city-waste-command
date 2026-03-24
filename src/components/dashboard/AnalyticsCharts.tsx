import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { collectionTrends, wasteByArea, fillPredictions } from "@/data/mockData";
import { Brain } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-2 text-xs border border-glass-border">
      <p className="text-muted-foreground font-mono mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Collection Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Collection Trends</h3>
            <p className="text-[10px] text-muted-foreground font-mono">Actual vs AI Predicted</p>
          </div>
          <div className="flex gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-primary" />Actual</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-neon-purple" />Predicted</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={collectionTrends}>
            <defs>
              <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(270, 100%, 65%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(270, 100%, 65%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 30%, 18%)" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(220, 20%, 55%)" }} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220, 20%, 55%)" }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="collections" name="Actual" stroke="hsl(185, 100%, 50%)" fill="url(#gradCyan)" strokeWidth={2} />
            <Area type="monotone" dataKey="predicted" name="Predicted" stroke="hsl(270, 100%, 65%)" fill="url(#gradPurple)" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Fill Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-primary animate-pulse-neon" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Fill Forecast</h3>
            <p className="text-[10px] text-muted-foreground font-mono">Bins expected to fill</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={fillPredictions}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 30%, 18%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220, 20%, 55%)" }} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220, 20%, 55%)" }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bins" name="Bins" fill="hsl(185, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Waste by Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4 lg:col-span-3"
      >
        <h3 className="text-sm font-semibold text-foreground mb-1">Waste Volume by Area</h3>
        <p className="text-[10px] text-muted-foreground font-mono mb-4">Current load vs capacity (tons)</p>
        <div className="space-y-3">
          {wasteByArea.map((area) => {
            const pct = Math.round((area.waste / area.capacity) * 100);
            const barColor = pct >= 80 ? "bg-destructive" : pct >= 50 ? "bg-neon-yellow" : "bg-secondary";
            return (
              <div key={area.area} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{area.area}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-20 text-right">{area.waste}/{area.capacity}t</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
