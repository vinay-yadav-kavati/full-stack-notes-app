import { LucideIcon, X, AlertTriangle, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  noteTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  icon?: LucideIcon;
  variant?: 'danger' | 'warning' | 'primary';
  error?: string | null;
  confirmButtonId?: string;
  cancelButtonId?: string;
  ariaLabelledBy?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  noteTitle,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  icon: CustomIcon,
  variant = 'danger',
  error,
  confirmButtonId,
  cancelButtonId,
  ariaLabelledBy = 'confirmation-modal-title',
}: ConfirmationModalProps) {
  const isDanger = variant === 'danger';

  const DefaultIcon = isDanger ? AlertTriangle : Trash2;
  const Icon = CustomIcon || DefaultIcon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isLoading && onClose()}
      ariaLabelledBy={ariaLabelledBy}
      closeOnBackdropClick={!isLoading}
    >
      {/* Header */}
      <div className="p-6 pb-2 flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDanger
              ? 'bg-red-100 dark:bg-red-950/60 text-[#EF4444] dark:text-red-400'
              : 'bg-indigo-100 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="px-6 py-2 space-y-2">
        <h2 id={ariaLabelledBy} className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          {title}
        </h2>
        <p className="text-sm text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
          {description}
          {noteTitle && (
            <span className="block mt-1 font-medium text-[#0F172A] dark:text-[#F8FAFC] italic truncate">
              "{noteTitle}"
            </span>
          )}
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[#EF4444] dark:text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="p-6 pt-4 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-[#E2E8F0] dark:border-[#334155] mt-4">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onClose}
          disabled={isLoading}
          id={cancelButtonId}
        >
          {cancelLabel}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          className={
            isDanger
              ? 'bg-[#EF4444] hover:bg-red-600 focus:ring-red-500/20 text-white border-transparent cursor-pointer'
              : 'bg-[#6366F1] hover:bg-indigo-600 focus:ring-indigo-500/20 text-white border-transparent cursor-pointer'
          }
          id={confirmButtonId}
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <span>{confirmLabel}</span>
          )}
        </Button>
      </div>
    </Modal>
  );
}
