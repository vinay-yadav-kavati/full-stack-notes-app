import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { NoteCard } from '../components/dashboard/NoteCard';
import { NoteCardSkeleton } from '../components/ui/Skeleton';
import { formatNoteDate } from '../utils';
import { Pin, Clock, ArrowRight, FileText } from 'lucide-react';

export function DashboardOverviewPage() {
  const navigate = useNavigate();
  const {
    dbNotes,
    isLoading,
    stats,
    recentActivities,
    openNewNoteModal,
    openEditNoteModal,
    openDeleteModal,
    togglePinNote,
    toggleArchiveNote,
  } = useNotes();

  // Filter notes directly from live Supabase dbNotes
  const pinnedNotes = dbNotes
    .filter((n) => n.is_pinned && !n.is_trashed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  const recentNotes = dbNotes
    .filter((n) => !n.is_archived && !n.is_trashed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  return (
    <div id="dashboard-overview-page" className="space-y-8">
      {/* 1. Welcome Card Banner */}
      <WelcomeCard onNewNote={openNewNoteModal} totalNotesCount={stats.total} />

      {/* 2. Statistics Section */}
      <StatsCard stats={stats} />

      {/* 3. Pinned Notes Section (Maximum 4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8] fill-[#6366F1] dark:fill-[#818CF8]" />
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Pinned Notes
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] text-xs font-semibold">
              {stats.pinned}
            </span>
          </div>

          {pinnedNotes.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/dashboard/notes')}
              className="text-xs font-semibold text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NoteCardSkeleton />
            <NoteCardSkeleton />
          </div>
        ) : pinnedNotes.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1]">
              No pinned notes.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Pin important notes to keep them easily accessible at the top of your dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={{
                  id: note.id,
                  title: note.title,
                  description: note.content || '',
                  updatedAt: formatNoteDate(note.updated_at),
                  isPinned: note.is_pinned,
                  isArchived: note.is_archived,
                  isTrashed: note.is_trashed,
                }}
                onEdit={() => openEditNoteModal(note)}
                onTogglePin={() => togglePinNote(note.id, note.is_pinned)}
                onToggleArchive={() => toggleArchiveNote(note.id, note.is_archived)}
                onDelete={() => openDeleteModal(note, false)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Recent Notes Section (Maximum 3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Recent Notes
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/notes')}
            className="text-xs font-semibold text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Go to Notes Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NoteCardSkeleton />
            <NoteCardSkeleton />
            <NoteCardSkeleton />
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#334155]">
            <p className="text-sm font-medium text-[#64748B] dark:text-[#CBD5E1]">
              No recent notes.
            </p>
            <button
              type="button"
              onClick={openNewNoteModal}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-bold hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Create Your First Note</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={{
                  id: note.id,
                  title: note.title,
                  description: note.content || '',
                  updatedAt: formatNoteDate(note.updated_at),
                  isPinned: note.is_pinned,
                  isArchived: note.is_archived,
                  isTrashed: note.is_trashed,
                }}
                onEdit={() => openEditNoteModal(note)}
                onTogglePin={() => togglePinNote(note.id, note.is_pinned)}
                onToggleArchive={() => toggleArchiveNote(note.id, note.is_archived)}
                onDelete={() => openDeleteModal(note, false)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Recent Activity Section */}
      <RecentActivityCard activities={recentActivities} />
    </div>
  );

}
