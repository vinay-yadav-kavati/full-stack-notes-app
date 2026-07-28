import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Plus, Pin, Tag, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroSection() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-200/40 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-[#6366F1] dark:text-[#818CF8] text-xs font-semibold tracking-wide mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Fast & Powerful Note Taking</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Organize Your Ideas{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
            Effortlessly
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-[#64748B] dark:text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
          Capture, organize and access your notes from anywhere.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/register')}
            id="hero-get-started-btn"
            className="w-full sm:w-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLearnMore}
            id="hero-learn-more-btn"
            className="w-full sm:w-auto"
          >
            Learn More
          </Button>
        </div>

        {/* Interactive / Visual App Preview Mockup */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-6 text-left relative overflow-hidden group transition-colors duration-200">
            {/* Window bar mockup */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#334155] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-2">My Workspace</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Synced</span>
              </div>
            </div>

            {/* Mock Header & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search notes..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] rounded-lg text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-3 h-3" /> New Note
                </span>
              </div>
            </div>

            {/* Sample Note Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Note 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1">
                    <Pin className="w-3 h-3 text-[#6366F1] dark:text-[#818CF8]" /> Product Roadmap 2026
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Just now</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] line-clamp-2 mb-3">
                  1. Launch new mobile responsive layout
                  2. Implement fast search and custom color tags...
                </p>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> Work
                  </span>
                </div>
              </div>

              {/* Note 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Weekly Goal Checklist</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">2h ago</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] line-clamp-2 mb-3">
                  ✓ Review UI wireframes
                  ✓ Complete component architecture
                  ○ Prepare launch demo
                </p>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-medium flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> Personal
                  </span>
                </div>
              </div>

              {/* Note 3 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors hidden sm:block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Book Recommendations</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Yesterday</span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] line-clamp-2 mb-3">
                  • Atomic Habits
                  • Designing Data-Intensive Applications
                  • Deep Work
                </p>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> Ideas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
