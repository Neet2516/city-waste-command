import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const DashboardHeader = () => {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{greeting}, <span className="text-primary">Admin</span></h2>
        <p className="text-xs text-muted-foreground">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} • System: <span className="text-secondary font-medium">Operational</span>
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bins, workers..."
            className="w-full sm:w-56 bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-accent transition-colors shrink-0"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
        </button>
        <button className="relative w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-accent transition-colors shrink-0">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[9px] font-mono text-destructive-foreground flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
