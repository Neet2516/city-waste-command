import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Users,
  Bell,
  BarChart3,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Map, label: "Bin Map", id: "map" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Users, label: "Workers", id: "workers" },
  { icon: Bell, label: "Alerts", id: "alerts", badge: 3 },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface Props {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border h-16">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center neon-glow-cyan shrink-0">
          <Trash2 className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-sm font-bold text-foreground tracking-wide">WASTE<span className="text-primary">AI</span></h1>
            <p className="text-[10px] text-muted-foreground">Smart City Ops</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]" : ""}`} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 ${collapsed ? "justify-center" : ""}`}>
          <Cpu className="w-4 h-4 text-primary animate-pulse-neon shrink-0" />
          {!collapsed && (
            <div>
              <p className="text-[10px] text-primary font-mono">AI ENGINE</p>
              <p className="text-[10px] text-muted-foreground">Online • Analyzing</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
};

export default DashboardSidebar;
