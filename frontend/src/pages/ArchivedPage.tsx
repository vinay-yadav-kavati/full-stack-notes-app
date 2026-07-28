import { useMemo } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/dashboard/NoteCard';
import { NoteCardSkeleton } from '../components/ui/Skeleton';
import { formatNoteDate } from '../utils';
import { Archive, Search, X } from 'lucide-react';

export function ArchivedPage() {
  const {
    dbNotes,
    isLoading,
    searchQuery,
    setSearchQuery,
    openEditNoteModal,
    openDeleteModal,
    toggleArchiveNote,
  } = useNotes();

  // Show only archived notes (is_archived = true AND is_trashed = false)
  const archivedNotes = useMemo(() => {
    let result = dbNotes.filter((n) => n.is_archived && !n.is_trashed);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content && n.content.toLowerCase().includes(q))
      );
    }

    return result.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [dbNotes, searchQuery]);

  return (
    <div id="archived-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-[#6366F1] dark:text-[#818CF8]" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Archived Notes
            </h1>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            View, restore, edit, or manage notes you have moved to archive.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#64748B] dark:text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search archived notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B]/60 dark:placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] dark:focus:border-[#818CF8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NoteCardSkeleton />
          <NoteCardSkeleton />
        </div>
      ) : archivedNotes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#334155] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {searchQuery ? 'No matching archived notes' : 'No archived notes'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No archived notes matched "${searchQuery}".`
                : 'When you archive notes, they will be safely kept here out of your main workspace.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={{
                id: note.id,
                title: note.title,
                description: note.content || '',
                updatedAt: formatNoteDate(note.updated_at),
                isPinned: note.is_pinned,
                isArchived: true,
                isTrashed: false,
              }}
              onEdit={() => openEditNoteModal(note)}
              onToggleArchive={() => toggleArchiveNote(note.id, true)}
              onDelete={() => openDeleteModal(note, false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
