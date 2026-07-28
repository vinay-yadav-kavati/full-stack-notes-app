import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/forms/Input';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { avatarService } from '../services/avatarService';
import {
  Sun,
  Moon,
  Monitor,
  User,
  Mail,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Key,
  Info,
  ArrowLeft,
  X,
  Database,
  Code2,
  Upload,
  Trash2,
} from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateAvatarUrl } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Avatar Upload & Remove States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Initialize Full Name from user metadata
  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || '';
      setFullName(name);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client side validations
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a JPG, PNG, or WEBP image.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Maximum image size is 5 MB.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const result = await avatarService.uploadAvatar(file);
      await updateAvatarUrl(result.publicUrl);
      showToast('Profile photo updated successfully.', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload profile photo.';
      showToast(message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmRemovePhoto = async () => {
    setIsRemoving(true);

    try {
      await avatarService.removeAvatar();
      await updateAvatarUrl(null);
      setIsRemoveModalOpen(false);
      showToast('Profile photo removed.', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove profile photo.';
      showToast(message, 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await updateProfile(fullName.trim());
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Settings saved successfully!', 'success');
      }
    } catch {
      showToast('An error occurred while saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset Full Name to original user metadata
    const originalName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    setFullName(originalName);
    showToast('Changes cancelled', 'success');
  };

  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const userEmail = user?.email || 'user@example.com';
  const displayFullName = fullName || user?.user_metadata?.full_name || 'User';
  const initials = displayFullName
    ? displayFullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userEmail.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
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
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-500 hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Settings
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
              Manage your account settings, appearance, and preferences.
            </p>
          </div>
        </div>

        {/* Quick Save / Cancel Header Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            id="settings-cancel-top-btn"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveChanges}
            isLoading={isSaving}
            id="settings-save-top-btn"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

          <form onSubmit={handleSaveChanges} className="space-y-6">
            {/* 1. APPEARANCE SECTION */}
            <section
              id="section-appearance"
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 shadow-2xs space-y-4 transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Appearance
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    Customize how Notes App looks on your device.
                  </p>
                </div>
              </div>

              {/* Theme Toggle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Light Option */}
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'border-[#6366F1] bg-indigo-50/40 dark:bg-indigo-950/30 text-[#6366F1] shadow-2xs'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  id="theme-option-light"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                      <Sun className="w-4 h-4" />
                    </div>
                    {themeMode === 'light' && (
                      <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      Light
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                      Clean & bright interface
                    </div>
                  </div>
                </button>

                {/* Dark Option */}
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                    themeMode === 'dark'
                      ? 'border-[#6366F1] bg-indigo-50/40 dark:bg-indigo-950/30 text-[#6366F1] shadow-2xs'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  id="theme-option-dark"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    {themeMode === 'dark' && (
                      <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      Dark
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                      Easy on the eyes in low light
                    </div>
                  </div>
                </button>

                {/* System Option */}
                <button
                  type="button"
                  onClick={() => setThemeMode('system')}
                  className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                    themeMode === 'system'
                      ? 'border-[#6366F1] bg-indigo-50/40 dark:bg-indigo-950/30 text-[#6366F1] shadow-2xs'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-slate-50/50 dark:bg-[#0F172A]/50 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  id="theme-option-system"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Monitor className="w-4 h-4" />
                    </div>
                    {themeMode === 'system' && (
                      <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      System
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                      Match your OS preferences
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* 2. ACCOUNT SECTION */}
            <section
              id="section-account"
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 shadow-2xs space-y-5 transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Account Information
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    Manage your personal account profile details.
                  </p>
                </div>
              </div>

              {/* Avatar & Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/60 border border-slate-200/60 dark:border-[#334155]">
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayFullName}
                      className="w-16 h-16 rounded-full object-cover shadow-md shrink-0 border border-[#E2E8F0] dark:border-[#334155]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {displayFullName}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] truncate">{userEmail}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] text-[10px] font-semibold">
                      Verified Account
                    </span>
                  </div>
                </div>

                {/* Photo Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    id="avatar-file-input"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                    isLoading={isUploading}
                    disabled={isUploading || isRemoving}
                    id="upload-photo-btn"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRemoveModalOpen(true)}
                      disabled={isUploading || isRemoving}
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      id="remove-photo-btn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Editable Full Name Input */}
              <div className="space-y-1">
                <Input
                  label="Full Name"
                  id="settings-fullname-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={User}
                />
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] pl-1">
                  This name will be displayed across your workspace and profile.
                </p>
              </div>

              {/* Read-Only Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    readOnly
                    id="settings-email-readonly-input"
                    className="w-full pl-9 pr-24 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-slate-100 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 text-xs font-medium cursor-not-allowed select-none"
                  />
                  <div className="absolute right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>Read Only</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] pl-1">
                  Email address cannot be modified directly for security reasons.
                </p>
              </div>
            </section>

            {/* 3. SECURITY SECTION */}
            <section
              id="section-security"
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 shadow-2xs space-y-4 transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Security
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    Manage password and access parameters.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/60 dark:bg-[#0F172A]/50 border border-slate-200/60 dark:border-[#334155]">
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Change Password
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                    Trigger a secure password reset email or update procedure.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/forgot-password')}
                  id="settings-change-password-btn"
                  className="shrink-0"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </Button>
              </div>
            </section>

            {/* 4. ABOUT SECTION */}
            <section
              id="section-about"
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 shadow-2xs space-y-4 transition-colors duration-200"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]/60 dark:border-[#334155]/60">
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    About App
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    Application details and technology specifications.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/60 border border-slate-200/60 dark:border-[#334155] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                    App Name
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Notes App
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/60 border border-slate-200/60 dark:border-[#334155] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                    Version
                  </span>
                  <span className="text-xs font-bold text-[#6366F1] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                    v1.0.0
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/60 border border-slate-200/60 dark:border-[#334155] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  <Code2 className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" />
                  <span>Built With</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Supabase'].map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] shadow-2xs"
                    >
                      {tech === 'Supabase' && <Database className="w-3 h-3 text-emerald-500" />}
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Form Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCancel}
                id="settings-cancel-bottom-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                id="settings-save-bottom-btn"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>

      {/* Remove Profile Photo Confirmation Modal */}
      <ConfirmationModal
        isOpen={isRemoveModalOpen}
        onClose={() => !isRemoving && setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemovePhoto}
        title="Remove Profile Photo?"
        description="Your profile picture will be removed."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isLoading={isRemoving}
        variant="danger"
        confirmButtonId="confirm-remove-photo-btn"
        cancelButtonId="cancel-remove-photo-btn"
        ariaLabelledBy="remove-profile-photo-modal-title"
      />
    </div>
  );
}
