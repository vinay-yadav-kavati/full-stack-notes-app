import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { TopNavbar } from '../components/dashboard/TopNavbar';
import { NewNoteModal } from '../components/dashboard/NewNoteModal';
import { DeleteConfirmationModal } from '../components/dashboard/DeleteConfirmationModal';
import { useNotes } from '../context/NotesContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function WorkspaceLayout() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    isNewNoteModalOpen,
    noteToEdit,
    closeNoteModal,
    toast,
  } = useNotes();

  // Determine current page title based on route
  const getPageTitle = (path: string) => {
    if (path === '/dashboard' || path === '/dashboard/') return 'Dashboard';
    if (path.startsWith('/dashboard/notes')) return 'Notes';
    if (path.startsWith('/dashboard/archived')) return 'Archived';
    if (path.startsWith('/dashboard/trash')) return 'Trash';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNavbar
        pageTitle={pageTitle}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={location.pathname === '/dashboard/notes'}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 pb-12">
          <Outlet />
        </main>
      </div>

      {/* Shared Create / Edit Note Modal */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={closeNoteModal}
        noteToEdit={noteToEdit}
      />

      {/* Shared Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
}
