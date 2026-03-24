import { motion } from "framer-motion";
import { Trash2, AlertTriangle, CheckCircle2, Users, TrendingUp, Zap } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
}

const stats: StatCard[] = [
  { label: "Total Bins", value: "1,247", change: "+12 this week", changeType: "neutral", icon: Trash2 },
  { label: "Bins Full", value: "38", change: "-15% vs yesterday", changeType: "positive", icon: AlertTriangle },
  { label: "Collected Today", value: "186", change: "+23% efficiency", changeType: "positive", icon: CheckCircle2 },
  { label: "Active Workers", value: "12", change: "3 on break", changeType: "neutral", icon: Users },
  { label: "AI Accuracy", value: "94%", change: "prediction rate", changeType: "positive", icon: TrendingUp },
  { label: "Efficiency", value: "A+", change: "Top 5% cities", changeType: "positive", icon: Zap },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="card-elevated-hover p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
            <span className={`text-[10px] font-medium ${
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
