import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Archive,
  Trash2,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { counts } = useNotes();

  const currentPath = location.pathname;

  // Listen for Escape key on mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    if (mobileOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      path: '/dashboard/notes',
      count: counts?.allNotes,
    },
    {
      id: 'archived',
      label: 'Archived',
      icon: Archive,
      path: '/dashboard/archived',
      count: counts?.archived,
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2,
      path: '/dashboard/trash',
      count: counts?.trash,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  const isItemActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard/';
    }
    return currentPath.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    navigate(path);
  };

  const handleLogout = async () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    await logout();
    navigate('/');
  };

  const sidebarContent = (
    <nav
      aria-label="Main Navigation"
      className="h-full flex flex-col justify-between bg-white dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] w-64 p-5 select-none transition-colors duration-200"
    >
      <div className="space-y-6">
        {/* Logo & Mobile Close */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleNavClick('/dashboard')}
          >
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-lg shadow-2xs"
              aria-hidden="true"
            >
              📝
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Notes App
            </span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider mb-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                  active
                    ? 'bg-[#6366F1]/10 dark:bg-[#818CF8]/20 text-[#6366F1] dark:text-[#818CF8] font-semibold shadow-2xs'
                    : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-[#6366F1] dark:text-[#818CF8]' : 'text-[#64748B] dark:text-[#CBD5E1]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      active
                        ? 'bg-[#6366F1] dark:bg-[#818CF8] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#CBD5E1]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
        <button
          onClick={handleLogout}
          id="sidebar-logout-btn"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs bg-white dark:bg-[#1E293B] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
