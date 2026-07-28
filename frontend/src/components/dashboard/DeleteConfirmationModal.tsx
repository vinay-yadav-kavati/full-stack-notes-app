import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useNotes } from '../../context/NotesContext';

export function DeleteConfirmationModal() {
  const { deleteTarget, closeDeleteModal, toggleTrashNote, deleteNotePermanently } = useNotes();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = Boolean(deleteTarget);
  const note = deleteTarget?.note;
  const isPermanent = deleteTarget?.isPermanent ?? false;

  if (!isOpen || !note) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      if (isPermanent) {
        await deleteNotePermanently(note.id);
      } else {
        await toggleTrashNote(note.id, note.is_trashed ?? false);
      }
      setIsDeleting(false);
      closeDeleteModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update note';
      setError(message);
      setIsDeleting(false);
    }
  };

  const title = isPermanent ? 'Delete permanently?' : 'Move note to Trash?';
  const description = isPermanent
    ? 'This note will be permanently deleted and cannot be recovered.'
    : 'This note will be moved to Trash. You can restore it later.';
  const confirmButtonLabel = isPermanent ? 'Delete Permanently' : 'Move to Trash';

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={closeDeleteModal}
      onConfirm={handleDelete}
      title={title}
      description={description}
      noteTitle={note.title}
      confirmLabel={confirmButtonLabel}
      cancelLabel="Cancel"
      isLoading={isDeleting}
      icon={isPermanent ? AlertTriangle : Trash2}
      variant={isPermanent ? 'danger' : 'primary'}
      error={error}
      confirmButtonId="confirm-delete-btn"
      cancelButtonId="cancel-delete-btn"
      ariaLabelledBy="delete-modal-title"
    />
  );
}
