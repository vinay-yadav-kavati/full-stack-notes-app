import { Clock, Edit2, Pin, PlusCircle, Trash, Archive, RefreshCw, Trash2 } from 'lucide-react';
import { getRelativeTimeString } from '../../utils';

export interface ActivityItem {
  id: string;
  title: string;
  time?: string;
  timestamp: number;
  type: 'created' | 'edited' | 'archived' | 'restored' | 'pinned' | 'unpinned' | 'trashed' | 'deleted';
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'created':
        return { icon: PlusCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#22C55E]' };
      case 'edited':
        return { icon: Edit2, bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1]' };
      case 'archived':
        return { icon: Archive, bg: 'bg-amber-50 dark:bg-amber-950/60 text-[#F59E0B]' };
      case 'restored':
        return { icon: RefreshCw, bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#10B981]' };
      case 'pinned':
      case 'unpinned':
        return { icon: Pin, bg: 'bg-purple-50 dark:bg-purple-950/60 text-[#8B5CF6]' };
      case 'trashed':
        return { icon: Trash, bg: 'bg-red-50 dark:bg-red-950/60 text-[#EF4444]' };
      case 'deleted':
        return { icon: Trash2, bg: 'bg-red-50 dark:bg-red-950/60 text-[#EF4444]' };
      default:
        return { icon: Edit2, bg: 'bg-slate-50 dark:bg-slate-800 text-slate-500' };
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-2xs space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Recent Activity
        </h3>
        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
          No recent activity.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((act) => {
            const { icon: Icon, bg } = getActivityIcon(act.type);
            const timeAgo = getRelativeTimeString(act.timestamp);
            return (
              <div
                key={act.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">{timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


