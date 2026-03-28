import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Route,
  Settings,
  SunMedium,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useMediaQuery } from '../hooks/useMediaQuery';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bin Management', href: '/bins', icon: Trash2 },
  { name: 'Map View', href: '/map', icon: Map },
  { name: 'Driver Routes', href: '/routes', icon: Route },
  { name: 'Ward Management', href: '/wards', icon: Building2 },
  { name: 'Workers', href: '/workers', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const sidebarWidth = isOpen ? 288 : 88;

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      onToggle();
    }
  };

  const sidebarLabel = isOpen ? 'Expanded sidebar' : 'Collapsed sidebar';

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        aria-label={sidebarLabel}
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -320) : 0,
          width: sidebarWidth,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/70 bg-background/90 text-foreground shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl',
          'supports-[backdrop-filter]:bg-background/75'
        )}
        style={{ width: sidebarWidth }}
      >
        <div className="border-b border-border/70 px-3 py-4">
          <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              <Trash2 className="h-5 w-5" />
            </motion.div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="sidebar-brand"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-0 flex-1"
                >
                  <h1 className="truncate text-lg font-semibold tracking-tight">WMAP</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto inline-flex h-9 w-9 rounded-xl md:hidden"
              aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
              title={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {isOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="ml-auto hidden h-9 w-9 rounded-xl md:inline-flex"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!isOpen && (
            <div className="mt-3 hidden items-center justify-center md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-9 w-9 rounded-xl"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.name}
                type="button"
                onClick={() => handleNavigation(item.href)}
                title={!isOpen ? item.name : undefined}
                whileHover={{ x: isOpen ? 2 : 0 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={cn(
                  'group flex h-12 w-full items-center rounded-2xl border text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary/20 bg-primary/10 text-primary shadow-sm'
                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground',
                  isOpen ? 'justify-start gap-3 px-4' : 'justify-center px-2'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key={item.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.16 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        <div className="border-t border-border/70 p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl bg-muted/60 px-3 py-3',
              !isOpen && 'justify-center px-2'
            )}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="h-4 w-4 text-sky-300" />
              ) : (
                <SunMedium className="h-4 w-4 text-amber-500" />
              )}
            </motion.div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="sidebar-footer"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.16 }}
                  className="min-w-0 flex-1"
                >
                  <div className="text-xs font-medium text-foreground">Theme</div>
                  <div className="text-xs text-muted-foreground">
                    {resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={cn('h-9 w-9 rounded-xl', !isOpen && 'ml-0')}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="border-t border-border/70 px-4 py-3">
          <div className={cn('flex items-center justify-between text-[11px] text-muted-foreground', !isOpen && 'hidden')}>
            <span>Waste Management System v1.0</span>
            <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggle}
            className={cn('mt-2 hidden h-9 w-9 rounded-xl md:inline-flex', isOpen && 'ml-auto')}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
