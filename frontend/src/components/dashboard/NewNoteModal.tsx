import { useState, FormEvent, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../forms/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Note } from '../../services/notesService';
import { useNotes } from '../../context/NotesContext';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
}

export function NewNoteModal({
  isOpen,
  onClose,
  noteToEdit,
}: NewNoteModalProps) {
  const { createNote, updateNote } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const isEditMode = Boolean(noteToEdit);

  // Sync or reset form state when modal opens/closes or noteToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (noteToEdit) {
        setTitle(noteToEdit.title || '');
        setContent(noteToEdit.content || '');
      } else {
        setTitle('');
        setContent('');
      }
      setError(null);
      setSuccessToast(null);
      setIsSaving(false);
    }
  }, [isOpen, noteToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessToast(null);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title must be 100 characters or fewer');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditMode && noteToEdit) {
        await updateNote(noteToEdit.id, {
          title: trimmedTitle,
          content: content.trim() || undefined,
        });
        setSuccessToast('Note updated successfully!');
      } else {
        await createNote({
          title: trimmedTitle,
          content: content.trim() || undefined,
        });
        setSuccessToast('Note created successfully!');
      }

      // Clear form and close modal after brief feedback
      setTimeout(() => {
        setTitle('');
        setContent('');
        setError(null);
        setSuccessToast(null);
        onClose();
      }, 500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An error occurred while saving the note';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSaving && onClose()}
      maxWidth="max-w-lg"
      ariaLabelledBy="new-note-modal-title"
      closeOnBackdropClick={!isSaving}
    >
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <h2 id="new-note-modal-title" className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          {isEditMode ? 'Edit Note' : 'Create New Note'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body / Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Error Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[#EF4444] dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Toast Banner */}
        {successToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[#22C55E] dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-1">
          <Input
            label="Note Title *"
            type="text"
            placeholder="e.g., Q4 Marketing Strategy"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            disabled={isSaving}
            autoFocus
            id="new-note-title"
            helperText={`${title.length}/100 characters`}
          />
        </div>

        {/* Content Textarea */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-note-content"
            className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-wide"
          >
            Content (Optional)
          </label>
          <textarea
            id="new-note-content"
            rows={5}
            placeholder="Write your note ideas, meeting summaries, or task lists here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSaving}
            className="w-full bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B]/60 dark:placeholder:text-[#CBD5E1]/50 text-sm rounded-xl border border-[#E2E8F0] dark:border-[#334155] focus:ring-2 focus:ring-[#6366F1]/20 dark:focus:ring-[#818CF8]/30 focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-all duration-200 outline-none p-3.5 resize-none disabled:opacity-60"
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSaving}
            id="cancel-note-btn"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving || !title.trim()}
            isLoading={isSaving}
            id="save-note-btn"
          >
            {isSaving ? (
              <span>{isEditMode ? 'Updating Note...' : 'Saving Note...'}</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Note' : 'Save Note'}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
