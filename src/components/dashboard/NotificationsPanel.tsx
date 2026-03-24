import { motion } from "framer-motion";
import { notifications } from "@/data/mockData";
import { AlertTriangle, Brain, Wrench, Info, Bell } from "lucide-react";

const priorityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/5",
  low: "border-l-muted-foreground bg-transparent",
};

const typeIcons = {
  overflow: AlertTriangle,
  "ai-alert": Brain,
  maintenance: Wrench,
  system: Info,
};

const NotificationsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card-elevated p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
            <p className="text-xs text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">
        {notifications.map((notif, i) => {
          const Icon = typeIcons[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.04 }}
              className={`border-l-2 rounded-r-lg p-3 ${priorityStyles[notif.priority]} ${!notif.read ? "" : "opacity-60"}`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${
                  notif.type === "ai-alert" ? "text-primary" : notif.priority === "high" ? "text-destructive" : "text-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                    <span className="text-[9px] text-muted-foreground font-mono shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
