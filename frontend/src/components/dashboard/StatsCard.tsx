import { FileText, Pin, Archive, Trash2 } from 'lucide-react';

export interface DashboardStats {
  total: number;
  pinned: number;
  archived: number;
  trashed: number;
}

interface StatsCardProps {
  stats: DashboardStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: 'Total Notes',
      value: stats.total,
      icon: FileText,
      color: 'text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/50',
    },
    {
      label: 'Pinned Notes',
      value: stats.pinned,
      icon: Pin,
      color: 'text-[#8B5CF6] bg-purple-50 dark:bg-purple-950/60 border-purple-100 dark:border-purple-900/50',
    },
    {
      label: 'Archived Notes',
      value: stats.archived,
      icon: Archive,
      color: 'text-[#22C55E] bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      label: 'Trashed Notes',
      value: stats.trashed,
      icon: Trash2,
      color: 'text-[#EF4444] bg-red-50 dark:bg-red-950/60 border-red-100 dark:border-red-900/50',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-2xs space-y-4 transition-colors duration-200">
      <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
        Workspace Statistics
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1]">
                  {stat.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

