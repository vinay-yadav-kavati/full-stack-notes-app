import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-lg shadow-sm transition-transform">
              📝
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Notes App
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollTo('hero')}
              className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleScrollTo('features')}
              className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('about')}
              className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              About
            </button>
          </div>

          {/* Desktop Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              id="landing-theme-toggle-btn"
              className="p-2 rounded-xl text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              id="nav-login-btn"
            >
              Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              id="nav-get-started-btn"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Mobile Theme Toggle & Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 pt-2 pb-3">
            <button
              onClick={() => handleScrollTo('hero')}
              className="text-left px-3 py-2 rounded-lg text-base font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleScrollTo('features')}
              className="text-left px-3 py-2 rounded-lg text-base font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('about')}
              className="text-left px-3 py-2 rounded-lg text-base font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              About
            </button>
          </div>
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
