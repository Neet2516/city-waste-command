import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, useLocation, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { WasteManagementProvider } from './context/WasteManagementContext.jsx';
import Dashboard from './pages/Dashboard.tsx';
import Bins from './pages/Bins.tsx';
import MapView from './pages/Map.tsx';
import DriverRoutes from './pages/DriverRoutes.tsx';
import Wards from './pages/Wards.tsx';
import Workers from './pages/Workers.tsx';
import Settings from './pages/Settings.tsx';
import NotFound from './pages/NotFound.tsx';
import Sidebar from './components/Sidebar.tsx';
import { Button } from './components/ui/button';
import { Menu } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { cn } from './lib/utils';

const queryClient = new QueryClient();
const desktopSidebarWidth = 288;
const desktopSidebarCollapsedWidth = 88;

const AppShell = () => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarOffset = isMobile ? 0 : sidebarOpen ? desktopSidebarWidth : desktopSidebarCollapsedWidth;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_28%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--background)))] text-foreground">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />

      {isMobile && !sidebarOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed left-4 top-4 z-40"
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-11 w-11 rounded-2xl shadow-lg shadow-slate-950/10"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      <motion.main
        animate={{ marginLeft: sidebarOffset }}
        transition={{ type: 'spring', stiffness: 280, damping: 34 }}
        className={cn(
          'min-h-screen min-w-0 overflow-x-hidden transition-[margin-left] duration-300 ease-out',
          isMobile ? 'ml-0' : ''
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="min-h-screen"
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bins" element={<Bins />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/routes" element={<DriverRoutes />} />
              <Route path="/wards" element={<Wards />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <WasteManagementProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </TooltipProvider>
      </WasteManagementProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
