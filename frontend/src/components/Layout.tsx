import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Home,
  PlusCircle,
  List,
  FileText,
  ClipboardCheck,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Submit Proposal', path: '/submit', icon: PlusCircle },
  { label: 'All Proposals', path: '/proposals', icon: List, roles: ['reviewer', 'chair', 'admin'] },
  { label: 'My Proposals', path: '/my-proposals', icon: FileText, roles: ['submitter'] },
  { label: 'Guidelines', path: '/guidelines', icon: BookOpen },
  { label: 'Review Queue', path: '/review', icon: ClipboardCheck, roles: ['reviewer', 'chair'] },
];

const adminItems = [
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Guidelines', path: '/admin/guidelines', icon: BookOpen },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.roles.includes('admin');

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="2.5" fill="white" opacity="0.9"/>
            <circle cx="21" cy="11" r="2.5" fill="white" opacity="0.9"/>
            <circle cx="16" cy="18" r="3" fill="white"/>
            <circle cx="10" cy="24" r="2" fill="white" opacity="0.8"/>
            <circle cx="22" cy="24" r="2" fill="white" opacity="0.8"/>
            <line x1="11" y1="13.5" x2="16" y2="15" stroke="white" strokeWidth="1.2" opacity="0.6"/>
            <line x1="21" y1="13.5" x2="16" y2="15" stroke="white" strokeWidth="1.2" opacity="0.6"/>
            <line x1="16" y1="21" x2="10" y2="24" stroke="white" strokeWidth="1.2" opacity="0.6"/>
            <line x1="16" y1="21" x2="22" y2="24" stroke="white" strokeWidth="1.2" opacity="0.6"/>
          </svg>
        </div>
        <div>
          <h1
            className="text-base font-bold text-primary cursor-pointer leading-tight"
            onClick={() => handleNav('/')}
          >
            AI CoE Portal
          </h1>
          <p className="text-[10px] text-muted-foreground">IQM Center of Excellence</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems
          .filter((item) => {
            if (item.roles) return item.roles.some((r) => user?.roles.includes(r));
            return true;
          })
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                size="sm"
                onClick={() => handleNav(item.path)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}

        {isAdmin && (
          <>
            <Separator className="my-3" />
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3"
                  size="sm"
                  onClick={() => handleNav(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          size="sm"
          onClick={() => handleNav('/settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <div className="flex items-center gap-2 px-3 py-2 mt-1">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-muted/30 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-background border-r flex flex-col shadow-xl">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold text-primary">AI CoE Portal</h1>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
