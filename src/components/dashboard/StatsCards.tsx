import { motion } from "framer-motion";
import { Trash2, AlertTriangle, CheckCircle2, Users, TrendingUp, Zap } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  accentColor: string;
}

const stats: StatCard[] = [
  { label: "Total Bins", value: "1,247", change: "+12 this week", changeType: "neutral", icon: Trash2, accentColor: "text-primary" },
  { label: "Bins Full", value: "38", change: "-15% vs yesterday", changeType: "positive", icon: AlertTriangle, accentColor: "text-neon-red" },
  { label: "Collected Today", value: "186", change: "+23% efficiency", changeType: "positive", icon: CheckCircle2, accentColor: "text-secondary" },
  { label: "Active Workers", value: "12", change: "3 on break", changeType: "neutral", icon: Users, accentColor: "text-neon-purple" },
  { label: "AI Predictions", value: "94%", change: "accuracy rate", changeType: "positive", icon: TrendingUp, accentColor: "text-neon-cyan" },
  { label: "Efficiency Score", value: "A+", change: "Top 5% cities", changeType: "positive", icon: Zap, accentColor: "text-neon-yellow" },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="glass-card-hover p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <stat.icon className={`w-5 h-5 ${stat.accentColor}`} />
            <span className={`text-[10px] font-mono ${
              stat.changeType === "positive" ? "text-secondary" : stat.changeType === "negative" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
