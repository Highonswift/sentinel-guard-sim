import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Video, FileText, BarChart3, Settings, AlertCircle, Grid3x3, Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/live', label: 'Live Cameras', icon: Video },
  { path: '/logs', label: 'Detection Logs', icon: FileText },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/cameras', label: 'Camera Mgmt', icon: Settings },
  { path: '/zones', label: 'Zone Masking', icon: Grid3x3 },
  { path: '/alerts', label: 'Alert Review', icon: AlertCircle },
];

interface NavigationProps {
  userRole: 'admin' | 'operator';
  onLogout: () => void;
}

export const Navigation = ({ userRole, onLogout }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">SENTINEL</h1>
              <p className="text-xs text-muted-foreground text-mono">Security Monitoring Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground glow-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-mono">SYSTEM ACTIVE</span>
            </div>
            
            <div className="h-6 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <Badge 
                  variant={userRole === 'admin' ? 'default' : 'secondary'}
                  className="text-xs font-mono uppercase"
                >
                  {userRole}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
