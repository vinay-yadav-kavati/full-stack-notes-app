import { FilePlus, Edit3, Search, ShieldCheck, Smartphone, Zap } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      id: 'feature-create',
      title: 'Create Notes',
      description: 'Quickly capture thoughts, checklists, and ideas with a distraction-free clean editor.',
      icon: FilePlus,
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]',
      borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-500',
    },
    {
      id: 'feature-edit',
      title: 'Edit Notes',
      description: 'Seamlessly update, format, and organize your content whenever inspiration strikes.',
      icon: Edit3,
      accentBg: 'bg-purple-50 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-400',
      borderHover: 'hover:border-purple-300 dark:hover:border-purple-500',
    },
    {
      id: 'feature-search',
      title: 'Search Notes',
      description: 'Instantly find any note or keyword with lighting-fast full-text search filters.',
      icon: Search,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] dark:text-emerald-400',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-500',
    },
    {
      id: 'feature-secure',
      title: 'Secure Storage',
      description: 'Your notes are protected with robust architecture ensuring privacy and safety.',
      icon: ShieldCheck,
      accentBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]',
      borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-500',
    },
    {
      id: 'feature-responsive',
      title: 'Responsive Design',
      description: 'Enjoy an optimized experience across mobile devices, tablets, and desktop displays.',
      icon: Smartphone,
      accentBg: 'bg-purple-50 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-400',
      borderHover: 'hover:border-purple-300 dark:hover:border-purple-500',
    },
    {
      id: 'feature-performance',
      title: 'Fast Performance',
      description: 'Built for speed with minimal latency so you can write and access notes instantly.',
      icon: Zap,
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E] dark:text-emerald-400',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-[#0F172A] border-y border-[#E2E8F0] dark:border-[#334155] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-semibold text-[#6366F1] dark:text-[#818CF8] uppercase tracking-wider">
            Powerful Features
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Designed for Modern Productivity
          </h3>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#CBD5E1]">
            Everything you need to capture thoughts, manage tasks, and organize information cleanly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] ${feature.borderHover} transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.accentBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
