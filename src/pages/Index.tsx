import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import BinGlobe from "@/components/dashboard/BinGlobe";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import WorkerPanel from "@/components/dashboard/WorkerPanel";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background grid-bg">
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="ml-[240px] p-6 transition-all duration-300">
        <DashboardHeader />
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-3">
          <div className="lg:col-span-3">
            <BinGlobe />
          </div>
          <div className="lg:col-span-2 grid grid-rows-2 gap-3">
            <WorkerPanel />
            <NotificationsPanel />
          </div>
        </div>
        <div className="mt-3">
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
};

export default Index;
