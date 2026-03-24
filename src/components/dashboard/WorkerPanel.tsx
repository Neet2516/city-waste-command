import { motion } from "framer-motion";
import { workers } from "@/data/mockData";
import { MapPin, TrendingUp } from "lucide-react";

const statusStyles = {
  "on-duty": "bg-primary/10 text-primary",
  available: "bg-secondary/10 text-secondary",
  offline: "bg-muted text-muted-foreground",
};

const statusDot = {
  "on-duty": "bg-primary",
  available: "bg-secondary",
  offline: "bg-muted-foreground",
};

const WorkerPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-elevated p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Worker Fleet</h3>
          <p className="text-xs text-muted-foreground">{workers.filter(w => w.status !== "offline").length} active • {workers.length} total</p>
        </div>
      </div>
      <div className="space-y-2">
        {workers.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                {worker.avatar}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusDot[worker.status]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{worker.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusStyles[worker.status]}`}>
                  {worker.status}
                </span>
                {worker.currentRoute && (
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5" />{worker.currentRoute}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-mono text-foreground">{worker.tasksCompleted}</p>
              <div className="flex items-center gap-0.5 text-[10px] text-secondary">
                <TrendingUp className="w-2.5 h-2.5" />{worker.efficiency}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WorkerPanel;
