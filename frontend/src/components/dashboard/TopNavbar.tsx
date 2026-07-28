import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Settings, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';
import { ProfileDetailsModal } from './ProfileDetailsModal';
import { UserProfileSkeleton } from '../ui/Skeleton';

interface TopNavbarProps {
  pageTitle?: string;
  onOpenMobileSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export function TopNavbar({
  pageTitle = 'Dashboard',
  onOpenMobileSidebar,
  searchQuery = '',
  onSearchChange,
  showSearch = false,
}: TopNavbarProps) {
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || 'user@example.com';
  const initials =
    fullName
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  // Calculate position and handle clicks outside / scroll / escape
  useEffect(() => {
    function updatePosition() {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 8,
          right: Math.max(16, window.innerWidth - rect.right),
        });
      }
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      setIsLogoutModalOpen(false);
      navigate('/', { replace: true });
    } catch {
      setIsLogoutModalOpen(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] px-4 sm:px-6 py-3.5 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Center: Search Bar (Only shown on Notes page) */}
        {showSearch && (
          <div className="flex items-center flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#64748B] dark:text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B]/60 dark:placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-all"
                id="dashboard-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Theme Toggle & User Profile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Mobile search icon button (Only shown on Notes page) */}
          {showSearch && (
            <button
              type="button"
              className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}


          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800/80 text-[#0F172A] dark:text-[#F8FAFC] transition-colors focus:outline-none cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#64748B]" />
            )}
          </button>

          {/* User Profile Avatar & Dropdown Container */}
          <div className="relative pl-2 border-l border-[#E2E8F0] dark:border-[#334155]" ref={dropdownRef}>
            {authLoading ? (
              <UserProfileSkeleton />
            ) : (
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
                id="profile-menu-button"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-9 h-9 rounded-full object-cover shadow-2xs shrink-0 border border-[#E2E8F0] dark:border-[#334155]"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                    {initials}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-tight truncate max-w-[110px]">
                    {fullName}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate max-w-[110px]">{email}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] dark:text-[#CBD5E1] transition-transform duration-200 hidden md:block ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}

            {/* Profile Dropdown Menu - Portaled to document.body for top-level z-index hierarchy */}
            {isMenuOpen &&
              dropdownPos &&
              createPortal(
                <div
                  ref={menuRef}
                  className="fixed w-64 bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#334155] py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right overflow-hidden"
                  style={{
                    top: `${dropdownPos.top}px`,
                    right: `${dropdownPos.right}px`,
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-menu-button"
                >
                  {/* Profile Section Header */}
                  <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/60 dark:bg-slate-800/60 flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 border border-[#E2E8F0] dark:border-[#334155]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{fullName}</p>
                      <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] truncate">{email}</p>
                    </div>
                  </div>

                  {/* Menu Action Items */}
                  <div className="py-1">
                    {/* My Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-indigo-50/60 dark:hover:bg-indigo-900/40 hover:text-[#6366F1] dark:hover:text-[#818CF8] flex items-center gap-2.5 transition-colors cursor-pointer"
                      role="menuitem"
                      id="profile-item-my-profile"
                    >
                      <User className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
                      <span>My Profile</span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-indigo-50/60 dark:hover:bg-indigo-900/40 hover:text-[#6366F1] dark:hover:text-[#818CF8] flex items-center justify-between transition-colors cursor-pointer"
                      role="menuitem"
                      id="profile-item-settings"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
                        <span>Settings</span>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-1">
                    {/* Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                      role="menuitem"
                      id="profile-item-logout"
                    >
                      <LogOut className="w-4 h-4 text-[#EF4444]" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>,
                document.body
              )}
          </div>
        </div>
      </div>

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </header>
  );
}



