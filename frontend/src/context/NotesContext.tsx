import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { notesService, Note, CreateNoteInput, UpdateNoteInput } from '../services/notesService';
import { useAuth } from './AuthContext';
import { ActivityItem } from '../components/dashboard/RecentActivityCard';

interface DashboardStats {
  total: number;
  pinned: number;
  archived: number;
  trashed: number;
}

interface SidebarCounts {
  allNotes: number;
  pinned: number;
  archived: number;
  trash: number;
}

interface NotesContextType {
  dbNotes: Note[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>;
  togglePinNote: (id: string, isPinned: boolean) => Promise<void>;
  toggleArchiveNote: (id: string, isArchived: boolean) => Promise<void>;
  toggleTrashNote: (id: string, isTrashed: boolean) => Promise<void>;
  deleteNotePermanently: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;

  stats: DashboardStats;
  counts: SidebarCounts;
  recentActivities: ActivityItem[];
  logActivity: (
    title: string,
    type: 'created' | 'edited' | 'pinned' | 'unpinned' | 'archived' | 'restored' | 'trashed' | 'deleted'
  ) => void;

  // Modals state
  isNewNoteModalOpen: boolean;
  noteToEdit: Note | null;
  openNewNoteModal: () => void;
  openEditNoteModal: (note: Note) => void;
  closeNoteModal: () => void;

  deleteTarget: { note: Note; isPermanent: boolean } | null;
  openDeleteModal: (note: Note, isPermanent: boolean) => void;
  closeDeleteModal: () => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [dbNotes, setDbNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ note: Note; isPermanent: boolean } | null>(null);

  // Toast & Search
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Explicit activity log entries
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const logActivity = useCallback(
    (
      title: string,
      type: 'created' | 'edited' | 'archived' | 'restored' | 'pinned' | 'unpinned' | 'trashed' | 'deleted'
    ) => {
      const newActivity: ActivityItem = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title,
        timestamp: Date.now(),
        type,
      };
      setActivities((prev) => {
        const updated = [newActivity, ...prev].slice(0, 30);
        if (user?.id) {
          try {
            localStorage.setItem(`user_activities_${user.id}`, JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
        return updated;
      });
    },
    [user?.id]
  );

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setDbNotes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const notes = await notesService.getNotes();
      setDbNotes(notes);

      // Initialize activities from localStorage or generate from Supabase notes
      if (user?.id) {
        const savedLogs = localStorage.getItem(`user_activities_${user.id}`);
        if (savedLogs) {
          try {
            setActivities(JSON.parse(savedLogs));
          } catch {
            // ignore
          }
        } else if (notes.length > 0) {
          const initialActivities: ActivityItem[] = [...notes]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5)
            .map((n) => {
              let type: ActivityItem['type'] = 'created';
              let title = `Created "${n.title}"`;
              if (n.is_trashed) {
                type = 'trashed';
                title = `Moved "${n.title}" to Trash`;
              } else if (n.is_archived) {
                type = 'archived';
                title = `Archived "${n.title}"`;
              } else if (n.is_pinned) {
                type = 'pinned';
                title = `Pinned "${n.title}"`;
              }
              return {
                id: 'act-' + Math.random().toString(36).substring(2, 7),
                title,
                timestamp: new Date(n.updated_at || n.created_at).getTime(),
                type,
              };
            });
          setActivities(initialActivities);
          localStorage.setItem(`user_activities_${user.id}`, JSON.stringify(initialActivities));
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch notes from database.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Derived statistics directly from live dbNotes
  const activeCount = dbNotes.filter((n) => !n.is_archived && !n.is_trashed).length;
  const pinnedCount = dbNotes.filter((n) => n.is_pinned && !n.is_trashed).length;
  const archivedCount = dbNotes.filter((n) => n.is_archived && !n.is_trashed).length;
  const trashedCount = dbNotes.filter((n) => n.is_trashed).length;

  const stats: DashboardStats = {
    total: activeCount + archivedCount,
    pinned: pinnedCount,
    archived: archivedCount,
    trashed: trashedCount,
  };

  const counts: SidebarCounts = {
    allNotes: activeCount,
    pinned: pinnedCount,
    archived: archivedCount,
    trash: trashedCount,
  };

  // Recent activity list
  const recentActivities: ActivityItem[] = activities.slice(0, 5);

  // CRUD Functions
  const createNote = async (input: CreateNoteInput): Promise<Note> => {
    const newNote = await notesService.createNote(input);
    setDbNotes((prev) => [newNote, ...prev]);
    logActivity(`Created "${newNote.title}"`, 'created');
    showToast('Note created successfully!');
    return newNote;
  };

  const updateNote = async (id: string, input: UpdateNoteInput): Promise<Note> => {
    const updated = await notesService.updateNote(id, input);
    setDbNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    logActivity(`Updated "${updated.title}"`, 'edited');
    showToast('Note updated successfully!');
    return updated;
  };

  const togglePinNote = async (id: string, isPinned: boolean): Promise<void> => {
    const noteToUpdate = dbNotes.find((n) => n.id === id);
    if (!noteToUpdate) return;
    const nextPinState = !isPinned;
    // Optimistic update
    setDbNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_pinned: nextPinState } : n))
    );
    try {
      const updated = await notesService.togglePinNote(id, nextPinState);
      setDbNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      logActivity(
        `${nextPinState ? 'Pinned' : 'Unpinned'} "${noteToUpdate.title}"`,
        nextPinState ? 'pinned' : 'unpinned'
      );
      showToast(nextPinState ? 'Note pinned!' : 'Note unpinned!');
    } catch (err) {
      // Revert on error
      setDbNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_pinned: isPinned } : n))
      );
      showToast('Failed to update pin status', 'error');
    }
  };

  const toggleArchiveNote = async (id: string, isArchived: boolean): Promise<void> => {
    const noteToUpdate = dbNotes.find((n) => n.id === id);
    if (!noteToUpdate) return;
    const nextArchiveState = !isArchived;
    setDbNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_archived: nextArchiveState } : n))
    );
    try {
      const updated = await notesService.toggleArchiveNote(id, nextArchiveState);
      setDbNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      logActivity(
        `${nextArchiveState ? 'Archived' : 'Restored'} "${noteToUpdate.title}"`,
        nextArchiveState ? 'archived' : 'restored'
      );
      showToast(nextArchiveState ? 'Note archived!' : 'Note restored from archive!');
    } catch (err) {
      setDbNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_archived: isArchived } : n))
      );
      showToast('Failed to update archive status', 'error');
    }
  };

  const toggleTrashNote = async (id: string, isTrashed: boolean): Promise<void> => {
    const noteToUpdate = dbNotes.find((n) => n.id === id);
    if (!noteToUpdate) return;
    const nextTrashState = !isTrashed;
    setDbNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_trashed: nextTrashState } : n))
    );
    try {
      const updated = await notesService.toggleTrashNote(id, nextTrashState);
      setDbNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      logActivity(
        `${nextTrashState ? 'Moved' : 'Restored'} "${noteToUpdate.title}"${nextTrashState ? ' to Trash' : ''}`,
        nextTrashState ? 'trashed' : 'restored'
      );
      showToast(nextTrashState ? 'Note moved to Trash!' : 'Note restored!');
    } catch (err) {
      setDbNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_trashed: isTrashed } : n))
      );
      showToast('Failed to update trash status', 'error');
    }
  };

  const deleteNotePermanently = async (id: string): Promise<void> => {
    const noteToDelete = dbNotes.find((n) => n.id === id);
    setDbNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await notesService.deleteNote(id);
      if (noteToDelete) {
        logActivity(`Permanently deleted "${noteToDelete.title}"`, 'deleted');
      }
      showToast('Note permanently deleted!');
    } catch (err) {
      fetchNotes();
      showToast('Failed to delete note permanently', 'error');
    }
  };

  const emptyTrash = async (): Promise<void> => {
    const previousNotes = [...dbNotes];
    // Optimistic UI update
    setDbNotes((prev) => prev.filter((n) => !n.is_trashed));

    try {
      await notesService.emptyTrash();
      logActivity('Emptied trash', 'deleted');
      showToast('Trash emptied successfully.');
    } catch (err) {
      // Revert state if backend call fails
      setDbNotes(previousNotes);
      const message = err instanceof Error ? err.message : 'Failed to empty trash';
      showToast(message, 'error');
      throw err;
    }
  };


  // Modal Control Helpers
  const openNewNoteModal = () => {
    setNoteToEdit(null);
    setIsNewNoteModalOpen(true);
  };

  const openEditNoteModal = (note: Note) => {
    setNoteToEdit(note);
    setIsNewNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNewNoteModalOpen(false);
    setNoteToEdit(null);
  };

  const openDeleteModal = (note: Note, isPermanent: boolean) => {
    setDeleteTarget({ note, isPermanent });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  return (
    <NotesContext.Provider
      value={{
        dbNotes,
        isLoading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        togglePinNote,
        toggleArchiveNote,
        toggleTrashNote,
        deleteNotePermanently,
        emptyTrash,

        stats,
        counts,
        recentActivities,
        logActivity,

        isNewNoteModalOpen,
        noteToEdit,
        openNewNoteModal,
        openEditNoteModal,
        closeNoteModal,

        deleteTarget,
        openDeleteModal,
        closeDeleteModal,

        toast,
        showToast,

        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
