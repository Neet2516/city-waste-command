import { Search, Bell, Cpu } from "lucide-react";

const DashboardHeader = () => {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{greeting}, <span className="neon-text-cyan">Admin</span></h2>
        <p className="text-xs text-muted-foreground font-mono">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} • System Status: <span className="text-secondary">Operational</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bins, workers..."
            className="bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
        <button className="relative w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:border-primary/30 transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[9px] font-mono text-destructive-foreground flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono text-primary">AI: Active</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
