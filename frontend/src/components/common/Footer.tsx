import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155] mt-20 text-slate-600 dark:text-slate-300 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-base shadow-2xs">
                📝
              </div>
              <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">Notes App</span>
            </div>
            <p className="text-sm text-[#64748B] dark:text-[#CBD5E1] max-w-sm">
              Capture ideas, stay organized, and access your notes anywhere with maximum speed and clarity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-wider uppercase mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-wider uppercase mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-[#CBD5E1]">
          <p>© {currentYear} Notes App. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-[#EF4444] animate-pulse">❤️</span>
            <span>for productive minds.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
