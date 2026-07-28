import { ReactNode } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
          <span className="text-xs font-semibold text-[#64748B]">Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div id="authenticated-layout" className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      {children || <Outlet />}
    </div>
  );
}


