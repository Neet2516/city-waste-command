import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import BinMap from "@/components/dashboard/BinMap";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import WorkerPanel from "@/components/dashboard/WorkerPanel";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import RouteOptimization from "@/components/dashboard/RouteOptimization";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="p-4 md:p-6 pt-16 md:pt-6 transition-all duration-200">
        <DashboardHeader />
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-3">
          <div className="lg:col-span-3">
            <BinMap showRoutes />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3">
            <RouteOptimization />
            <WorkerPanel />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
          <div className="lg:col-span-2">
            <NotificationsPanel />
          </div>
          <div className="lg:col-span-1" />
        </div>
        <div className="mt-3">
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
};

export default Index;
