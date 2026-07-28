import { ReactNode } from 'react';
import { FileText, Search, Archive, Trash2, Pin } from 'lucide-react';
import { Button } from '../ui/Button';

export type EmptyStateType = 'no-notes' | 'search-empty' | 'archive-empty' | 'trash-empty' | 'pinned-empty';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  actionLabel?: string;
  heading?: string;
  description?: string;
  customHeading?: string;
  customDescription?: string;
  icon?: ReactNode;
}

export function EmptyState({
  type,
  onAction,
  actionLabel,
  heading: headingProp,
  description: descriptionProp,
  customHeading,
  customDescription,
  icon,
}: EmptyStateProps) {
  let defaultIcon = <FileText className="w-8 h-8" />;
  let heading = 'No notes yet';
  let description = 'Create your first note to get started.';
  let defaultButtonLabel = 'Create Note';
  let iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]';

  switch (type) {
    case 'no-notes':
      defaultIcon = <FileText className="w-7 h-7" />;
      heading = 'No notes yet';
      description = 'Create your first note to get started.';
      defaultButtonLabel = 'Create Note';
      iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]';
      break;

    case 'search-empty':
      defaultIcon = <Search className="w-7 h-7" />;
      heading = 'No matching notes';
      description = 'Try another keyword or clear your search.';
      defaultButtonLabel = 'Clear Search';
      iconBgColor = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
      break;

    case 'archive-empty':
      defaultIcon = <Archive className="w-7 h-7" />;
      heading = 'No archived notes';
      description = 'Archived notes will appear here.';
      defaultButtonLabel = '';
      iconBgColor = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400';
      break;

    case 'trash-empty':
      defaultIcon = <Trash2 className="w-7 h-7" />;
      heading = 'Trash is empty';
      description = 'Deleted notes will appear here until permanently removed.';
      defaultButtonLabel = '';
      iconBgColor = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
      break;

    case 'pinned-empty':
      defaultIcon = <Pin className="w-7 h-7" />;
      heading = 'No pinned notes';
      description = 'Pin important notes to access them quickly at the top.';
      defaultButtonLabel = '';
      iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]';
      break;
  }

  const finalHeading = headingProp || customHeading || heading;
  const finalDescription = descriptionProp || customDescription || description;
  const finalButtonText = actionLabel || defaultButtonLabel;

  return (
    <div
      id={`empty-state-${type}`}
      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-10 sm:p-12 text-center space-y-4 shadow-2xs transition-colors duration-200 max-w-lg mx-auto my-4"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-2xs transition-transform hover:scale-105 ${iconBgColor}`}
      >
        {icon || defaultIcon}
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          {finalHeading}
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
          {finalDescription}
        </p>
      </div>

      {onAction && finalButtonText && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            className="mx-auto font-semibold shadow-xs"
            id={`empty-state-action-btn-${type}`}
          >
            {finalButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
