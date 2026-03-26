import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { WasteManagementProvider } from "./context/WasteManagementContext.jsx";
import Dashboard from "./pages/Dashboard.tsx";
import Bins from "./pages/Bins.tsx";
import MapView from "./pages/Map.tsx";
import NotFound from "./pages/NotFound.tsx";
import Sidebar from "./components/Sidebar.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <WasteManagementProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bins" element={<Bins />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </WasteManagementProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
