import { useState, useMemo } from 'react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/dashboard/NoteCard';
import { NoteCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { formatNoteDate } from '../utils';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Pin,
  FileText,
  X,
} from 'lucide-react';

export function NotesPage() {
  const {
    dbNotes,
    isLoading,
    searchQuery,
    setSearchQuery,
    openNewNoteModal,
    openEditNoteModal,
    openDeleteModal,
    togglePinNote,
    toggleArchiveNote,
  } = useNotes();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'created'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter only active notes (is_archived = false AND is_trashed = false)
  const activeNotes = useMemo(() => {
    return dbNotes.filter((n) => !n.is_archived && !n.is_trashed);
  }, [dbNotes]);

  // Apply search query and category filter
  const filteredNotes = useMemo(() => {
    let result = activeNotes;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          (n.content && n.content.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter((n) => {
        const titleLower = n.title.toLowerCase();
        const categoryLower = categoryFilter.toLowerCase();
        return titleLower.includes(categoryLower);
      });
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'created') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default: updated
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeNotes, searchQuery, categoryFilter, sortBy]);

  // Split into pinned and unpinned for clean organization
  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.is_pinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.is_pinned),
    [filteredNotes]
  );

  return (
    <div id="notes-page" className="space-y-6">
      {/* Workspace Header & Action Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Notes Workspace
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            Manage, organize, and edit all your active notes in one place.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openNewNoteModal}
          id="notes-page-new-note-btn"
          className="shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Note</span>
        </Button>
      </div>

      {/* Filter / Sort / Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1E293B] p-3 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-2xs">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] dark:text-[#CBD5E1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B]/60 dark:placeholder:text-[#CBD5E1]/60 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] dark:focus:border-[#818CF8]"
            id="notes-search-input"
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Sort Select */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updated' | 'title' | 'created')}
              className="bg-transparent focus:outline-none cursor-pointer"
              aria-label="Sort notes"
            >
              <option value="updated" className="dark:bg-[#1E293B]">Updated Date</option>
              <option value="created" className="dark:bg-[#1E293B]">Created Date</option>
              <option value="title" className="dark:bg-[#1E293B]">Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-[#334155]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1E293B] text-[#6366F1] dark:text-[#818CF8] shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#1E293B] text-[#6366F1] dark:text-[#818CF8] shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NoteCardSkeleton />
          <NoteCardSkeleton />
          <NoteCardSkeleton />
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#334155] space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {searchQuery ? 'No notes found' : 'No notes available'}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No notes matched "${searchQuery}". Try searching for something else.`
                : 'Create your first note to start organizing your thoughts, ideas, and tasks.'}
            </p>
          </div>
          {!searchQuery && (
            <Button
              variant="primary"
              size="sm"
              onClick={openNewNoteModal}
              className="mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </Button>
          )}
        </div>
      ) : (
        /* Notes Content Grid */
        <div className="space-y-8">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 text-xs font-bold uppercase tracking-wider text-[#6366F1] dark:text-[#818CF8]">
                <Pin className="w-3.5 h-3.5 fill-[#6366F1] dark:fill-[#818CF8]" />
                <span>Pinned ({pinnedNotes.length})</span>
              </div>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'flex flex-col gap-3'
                }
              >
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
            </div>
          )}

          {/* Other Notes Section */}
          {otherNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#CBD5E1]">
                  Other Notes ({otherNotes.length})
                </div>
              )}
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'flex flex-col gap-3'
                }
              >
                {otherNotes.map((note) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
