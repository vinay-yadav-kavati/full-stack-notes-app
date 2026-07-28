import { User, Mail, ShieldCheck, Calendar, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDetailsModal({ isOpen, onClose }: ProfileDetailsModalProps) {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || null;
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || 'user@example.com';
  const initials = fullName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="profile-modal-title">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-800/50">
        <h2 id="profile-modal-title" className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          My Profile
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Card Body */}
      <div className="p-6 space-y-6">
        {/* Avatar & Main Info */}
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover shadow-md shrink-0 border border-[#E2E8F0] dark:border-[#334155]"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {initials}
            </div>
          )}
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{fullName}</h3>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] truncate">{email}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-900/50">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Active Account
            </span>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="space-y-3 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-[#334155]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1]">
              <User className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
              <span>Full Name</span>
            </div>
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">{fullName}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-[#334155]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1]">
              <Mail className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
              <span>Email Address</span>
            </div>
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate max-w-[180px]">{email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-[#334155]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1]">
              <Calendar className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
              <span>Member Since</span>
            </div>
            <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">{createdAt}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-[#E2E8F0] dark:border-[#334155] flex justify-end">
        <Button type="button" variant="outline" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
