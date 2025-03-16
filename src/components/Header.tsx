
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  firmId?: string;
}

const Header: React.FC<HeaderProps> = ({ firmId }) => {
  const location = useLocation();
  
  return (
    <header className="w-full border-b border-border backdrop-blur-sm bg-background/80 fixed top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-sm">LS</span>
          </div>
          <span className="font-medium text-lg tracking-tight">LawScheduling</span>
        </Link>
        
        {firmId && (
          <nav className="flex items-center space-x-6">
            <Link 
              to={`/${firmId}/intake`} 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === `/${firmId}/intake` ? "text-primary" : "text-muted-foreground"
              )}
            >
              Client Intake
            </Link>
            <Link 
              to={`/${firmId}/back`} 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === `/${firmId}/back` ? "text-primary" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
