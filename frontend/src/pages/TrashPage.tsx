import { useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/dashboard/NoteCard';
import { NoteCardSkeleton } from '../components/ui/Skeleton';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { formatNoteDate } from '../utils';
import { Trash2, Search, X, AlertTriangle } from 'lucide-react';

export function TrashPage() {
  const {
    dbNotes,
    isLoading,
    searchQuery,
    setSearchQuery,
    toggleTrashNote,
    openDeleteModal,
    emptyTrash,
  } = useNotes();

  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Total count of trashed notes (unfiltered by search)
  const totalTrashedCount = useMemo(() => dbNotes.filter((n) => n.is_trashed).length, [dbNotes]);

  // Filtered trashed notes for display
  const trashedNotes = useMemo(() => {
    let result = dbNotes.filter((n) => n.is_trashed);

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

  const handleEmptyTrash = async () => {
    setIsDeleting(true);
    try {
      await emptyTrash();
      setIsEmptyModalOpen(false);
    } catch {
      // Error is handled in context with toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div id="trash-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-[#EF4444]" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Trash
            </h1>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            Notes in Trash can be restored to your workspace or deleted permanently.
          </p>
        </div>

        {/* Right Controls: Search & Empty Trash */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#64748B] dark:text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search trash..."
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

          {/* Empty Trash Button - Only visible if there is at least 1 note in trash */}
          {totalTrashedCount > 0 && (
            <button
              type="button"
              onClick={() => setIsEmptyModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-[#EF4444] dark:text-red-400 text-xs font-semibold rounded-xl border border-red-200/80 dark:border-red-900/60 transition-colors cursor-pointer shrink-0"
              id="empty-trash-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Trash</span>
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
      ) : trashedNotes.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#334155] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/60 text-[#EF4444] flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {searchQuery ? 'No matching notes in trash' : 'Trash is empty'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No trashed notes matched "${searchQuery}".`
                : 'There are no notes currently in Trash.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trashedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={{
                id: note.id,
                title: note.title,
                description: note.content || '',
                updatedAt: formatNoteDate(note.updated_at),
                isPinned: note.is_pinned,
                isArchived: note.is_archived,
                isTrashed: true,
              }}
              onRestore={() => toggleTrashNote(note.id, true)}
              onDeletePermanently={() => openDeleteModal(note, true)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEmptyModalOpen}
        onClose={() => setIsEmptyModalOpen(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Trash?"
        description="This will permanently delete all notes in Trash. This action cannot be undone."
        confirmLabel="Delete All"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        icon={AlertTriangle}
        variant="danger"
        confirmButtonId="confirm-empty-trash-btn"
        cancelButtonId="cancel-empty-trash-btn"
        ariaLabelledBy="empty-trash-modal-title"
      />
    </div>
  );
}
