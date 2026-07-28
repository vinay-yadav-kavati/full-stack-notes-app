import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface GuestLayoutProps {
  children?: ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div id="guest-layout" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="flex-1 w-full">
        {children || <Outlet />}
      </div>
    </div>
  );
}

