import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trash2, 
  Map, 
  Building2, 
  Users, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Bin Management',
    href: '/bins',
    icon: Trash2,
  },
  {
    name: 'Map View',
    href: '/map',
    icon: Map,
  },
  {
    name: 'Ward Management',
    href: '/wards',
    icon: Building2,
  },
  {
    name: 'Workers',
    href: '/workers',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (href) => {
    navigate(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20",
          "md:w-64 md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold text-foreground">WMAP</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isOpen ? "px-4 py-2" : "px-2 py-2 justify-center",
                  isActive && "bg-primary/10 hover:bg-primary/20"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                {isOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          {isOpen && (
            <div className="text-xs text-muted-foreground text-center">
              Waste Management System v1.0
            </div>
          )}
        </div>
      </aside>

      {/* Main content offset */}
      <div
        aria-hidden="true"
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20"
        )}
      />
    </>
  );
};

export default Sidebar;
