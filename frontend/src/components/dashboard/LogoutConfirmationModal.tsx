import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirm();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleLogout}
      title="Logout?"
      description="Are you sure you want to logout?"
      confirmLabel="Logout"
      cancelLabel="Cancel"
      isLoading={isLoggingOut}
      icon={LogOut}
      variant="danger"
      confirmButtonId="confirm-logout-btn"
      cancelButtonId="cancel-logout-btn"
      ariaLabelledBy="logout-modal-title"
    />
  );
}
