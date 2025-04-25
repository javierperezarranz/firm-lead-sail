
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  firmId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ firmId }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    {
      name: "Leads",
      path: `/${firmId}/back/leads`,
      icon: User
    },
    {
      name: "Account Settings",
      path: `/${firmId}/back/account`,
      icon: Settings
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMobileMenu}
          className="rounded-full"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar - hidden on mobile unless opened */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 bg-sidebar z-40 w-64 border-r border-border transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-semibold text-sm">LS</span>
              </div>
              <span className="font-medium text-lg tracking-tight">LawScheduling</span>
            </Link>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-sidebar-accent text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", isActive(item.path) ? "text-primary" : "text-sidebar-foreground")} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {firmId}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Law Firm
                </p>
              </div>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
