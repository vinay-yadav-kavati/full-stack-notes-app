import { Pin, Edit3, Trash2, Archive, ArchiveRestore, RotateCcw, Tag, Calendar, Loader2 } from 'lucide-react';

export interface NoteItem {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
  category?: 'Work' | 'Personal' | 'Ideas' | 'Important' | string;
}

interface NoteCardProps {
  note: NoteItem;
  isRestoring?: boolean;
  isArchiving?: boolean;
  onTogglePin?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDeletePermanently?: (id: string) => void;
}

export function NoteCard({
  note,
  isRestoring = false,
  isArchiving = false,
  onTogglePin,
  onToggleArchive,
  onRestore,
  onEdit,
  onDelete,
  onDeletePermanently,
}: NoteCardProps) {
  const categoryKey = (note.category || 'Note') as keyof typeof tagStyles;

  const tagStyles = {
    Work: 'bg-indigo-50 dark:bg-indigo-950/50 text-[#6366F1] dark:text-[#818CF8] border-indigo-100 dark:border-indigo-900/50',
    Personal: 'bg-purple-50 dark:bg-purple-950/50 text-[#8B5CF6] dark:text-purple-300 border-purple-100 dark:border-purple-900/50',
    Ideas: 'bg-emerald-50 dark:bg-emerald-950/50 text-[#22C55E] dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    Important: 'bg-amber-50 dark:bg-amber-950/50 text-[#F59E0B] dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    Note: 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const styleClass = tagStyles[categoryKey] || tagStyles.Note;

  const handleCardClick = () => {
    if (!note.isTrashed && onEdit) {
      onEdit(note.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !note.isTrashed && onEdit) {
      e.preventDefault();
      onEdit(note.id);
    }
  };

  return (
    <article
      tabIndex={note.isTrashed ? undefined : 0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`Note: ${note.title}`}
      className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] dark:focus-visible:ring-[#818CF8] ${
        note.isTrashed
          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 shadow-2xs'
          : note.isPinned
          ? 'bg-indigo-50/30 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800/80 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer'
          : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] shadow-2xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/50 cursor-pointer'
      }`}
    >
      {/* Top Bar: Title & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className={`font-bold text-base transition-colors line-clamp-1 ${
              note.isTrashed
                ? 'text-slate-500 dark:text-slate-400 line-through'
                : 'text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8]'
            }`}
          >
            {note.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {note.isTrashed ? (
              <>
                {/* Restore Button */}
                <button
                  type="button"
                  disabled={isRestoring}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRestore) onRestore(note.id);
                  }}
                  className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer disabled:opacity-60"
                  title="Restore note"
                  aria-label="Restore note"
                >
                  {isRestoring ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                </button>
                {/* Delete Permanently Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeletePermanently) {
                      onDeletePermanently(note.id);
                    } else if (onDelete) {
                      onDelete(note.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#EF4444] hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  title="Delete Permanently"
                  aria-label="Delete Permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTogglePin) onTogglePin(note.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    note.isPinned
                      ? 'text-[#6366F1] dark:text-[#818CF8] bg-indigo-100/80 dark:bg-indigo-900/60 hover:bg-indigo-200/80 dark:hover:bg-indigo-800/80'
                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                  aria-label="Pin note"
                >
                  <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-[#6366F1] dark:fill-[#818CF8] text-[#6366F1] dark:text-[#818CF8]' : ''}`} />
                </button>
                <button
                  type="button"
                  disabled={isArchiving}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleArchive) onToggleArchive(note.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-60 ${
                    note.isArchived
                      ? 'text-[#6366F1] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                      : 'text-slate-400 hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                  }`}
                  title={note.isArchived ? 'Unarchive Note' : 'Archive Note'}
                  aria-label={note.isArchived ? 'Unarchive note' : 'Archive note'}
                >
                  {isArchiving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#6366F1] dark:text-[#818CF8]" />
                  ) : note.isArchived ? (
                    <ArchiveRestore className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEdit) onEdit(note.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                  title="Edit note"
                  aria-label="Edit note"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete(note.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  title="Delete note"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Short Description (max 3 lines) */}
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
          {note.description || <span className="italic text-slate-400 dark:text-slate-500">No content</span>}
        </p>
      </div>

      {/* Bottom Footer: Category Tag & Updated Date */}
      <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-[#334155]/60 flex items-center justify-between text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <span
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 ${styleClass}`}
        >
          <Tag className="w-3 h-3" />
          {note.category || 'Note'}
        </span>

        <div className="flex items-center gap-1 text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
          <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span>{note.updatedAt}</span>
        </div>
      </div>
    </article>
  );
}
