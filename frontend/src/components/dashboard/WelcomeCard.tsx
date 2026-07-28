import { Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface WelcomeCardProps {
  onNewNote?: () => void;
  totalNotesCount?: number;
}

export function WelcomeCard({ onNewNote, totalNotesCount = 0 }: WelcomeCardProps) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name?.trim() || user?.email || 'User';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-2xl p-6 sm:p-8 text-white shadow-md">
      {/* Background Accent Graphics */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-20 top-0 w-32 h-32 bg-indigo-300/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Productivity Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Organize your ideas efficiently. You have {totalNotesCount} {totalNotesCount === 1 ? 'note' : 'notes'} saved in your workspace.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onNewNote}
          id="new-note-btn"
          className="bg-white text-[#6366F1] border-none hover:bg-indigo-50 shadow-md font-semibold text-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Note</span>
        </Button>
      </div>
    </div>
  );
}

