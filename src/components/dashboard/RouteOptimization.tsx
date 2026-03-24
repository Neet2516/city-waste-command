import { motion } from "framer-motion";
import { Route, Clock, Fuel, TrendingDown, CheckCircle2 } from "lucide-react";
import { bins, workers } from "@/data/mockData";

const optimizedRoutes = [
  {
    id: "R1",
    name: "Downtown East",
    worker: "Alex Chen",
    bins: bins.filter(b => b.fillLevel >= 70).length,
    distance: "12.3 km",
    eta: "45 min",
    savings: "23 min saved",
    status: "active" as const,
  },
  {
    id: "R2",
    name: "Midtown West",
    worker: "James Wilson",
    bins: 4,
    distance: "8.7 km",
    eta: "32 min",
    savings: "15 min saved",
    status: "active" as const,
  },
  {
    id: "R3",
    name: "Park District",
    worker: "Maria Santos",
    bins: 3,
    distance: "6.2 km",
    eta: "22 min",
    savings: "8 min saved",
    status: "pending" as const,
  },
];

const RouteOptimization = () => {
  const totalSavings = "46 min";
  const fuelSavings = "12%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-elevated p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Route className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Route Optimization</h3>
            <p className="text-xs text-muted-foreground">Optimized collection paths</p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">{totalSavings}</p>
          <p className="text-[10px] text-muted-foreground">Time saved</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <Fuel className="w-3.5 h-3.5 text-secondary mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">{fuelSavings}</p>
          <p className="text-[10px] text-muted-foreground">Fuel saved</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <TrendingDown className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
          <p className="text-sm font-bold text-foreground">3</p>
          <p className="text-[10px] text-muted-foreground">Active routes</p>
        </div>
      </div>

      {/* Routes */}
      <div className="space-y-2">
        {optimizedRoutes.map((route, i) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              route.status === "active" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
            }`}>
              {route.status === "active" ? <CheckCircle2 className="w-4 h-4" /> : route.id}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{route.name}</p>
              <p className="text-xs text-muted-foreground">{route.worker} • {route.bins} bins • {route.distance}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-foreground">{route.eta}</p>
              <p className="text-[10px] text-secondary">{route.savings}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RouteOptimization;
