import { CheckCircle2, Shield, Flame, Laptop } from 'lucide-react';

export function AboutSection() {
  const highlights = [
    {
      icon: CheckCircle2,
      title: 'Zero Distractions',
      desc: 'Clean interfaces engineered to keep your focus strictly on your thoughts.',
    },
    {
      icon: Laptop,
      iconColor: 'text-[#8B5CF6]',
      title: 'Cross-Device Clarity',
      desc: 'Access your workspace seamlessly whether on desktop, tablet, or phone.',
    },
    {
      icon: Flame,
      iconColor: 'text-[#22C55E]',
      title: 'Instant Execution',
      desc: 'Lightning fast rendering and interaction built on modern web standards.',
    },
    {
      icon: Shield,
      iconColor: 'text-[#6366F1]',
      title: 'Reliable Architecture',
      desc: 'Designed with a scalable full-stack foundation ready for real-time sync.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-400 text-xs font-semibold">
              <span>About Notes App</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-tight">
              Built for Thinkers, Creators & Doers
            </h2>
            <p className="text-base text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
              Notes App was conceived with a simple philosophy: taking notes should be effortless, fast, and structured. Whether drafting a quick idea, organizing project tasks, or documenting study notes, our workspace provides the ideal environment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start">
                    <Icon className={`w-5 h-5 ${item.iconColor || 'text-[#6366F1] dark:text-[#818CF8]'} shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">{item.title}</h4>
                      <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column Visual Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-[#E2E8F0] dark:border-[#334155] shadow-sm relative space-y-6 transition-colors duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                System Stats
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-900/50">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                <div className="text-2xl font-extrabold text-[#6366F1] dark:text-[#818CF8]">100%</div>
                <div className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-medium mt-1">Focus Driven</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                <div className="text-2xl font-extrabold text-[#8B5CF6] dark:text-purple-400">0ms</div>
                <div className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-medium mt-1">Lag Time</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                <div className="text-2xl font-extrabold text-[#22C55E] dark:text-emerald-400">24/7</div>
                <div className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-medium mt-1">Accessibility</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-200/60 dark:border-[#334155]">
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">Clean</div>
                <div className="text-xs text-[#64748B] dark:text-[#CBD5E1] font-medium mt-1">User Interface</div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6366F1] dark:text-[#818CF8]">Ready to simplify your note-taking?</span>
              <a
                href="#hero"
                className="text-xs font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Get Started →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
