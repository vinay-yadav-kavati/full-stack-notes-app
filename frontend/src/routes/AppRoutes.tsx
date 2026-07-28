import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GuestLayout } from '../layouts/GuestLayout';
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout';
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { NotesProvider } from '../context/NotesContext';
import { PageSkeleton } from '../components/ui/Skeleton';

const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

const DashboardOverviewPage = lazy(() => import('../pages/DashboardOverviewPage').then(m => ({ default: m.DashboardOverviewPage })));
const NotesPage = lazy(() => import('../pages/NotesPage').then(m => ({ default: m.NotesPage })));
const ArchivedPage = lazy(() => import('../pages/ArchivedPage').then(m => ({ default: m.ArchivedPage })));
const TrashPage = lazy(() => import('../pages/TrashPage').then(m => ({ default: m.TrashPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Authenticated Routes with Notes Provider & Workspace Layout */}
        <Route
          element={
            <AuthenticatedLayout>
              <NotesProvider>
                <WorkspaceLayout />
              </NotesProvider>
            </AuthenticatedLayout>
          }
        >
          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/notes" element={<NotesPage />} />
          <Route path="/dashboard/archived" element={<ArchivedPage />} />
          <Route path="/dashboard/trash" element={<TrashPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
