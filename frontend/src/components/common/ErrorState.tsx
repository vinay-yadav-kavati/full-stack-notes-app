import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldAlert, FileQuestion, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export type ErrorStateType = 'network' | 'permission' | '404' | 'generic';

interface ErrorStateProps {
  type?: ErrorStateType;
  heading?: string;
  description?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  type = 'network',
  heading,
  description,
  onRetry,
  onGoHome,
  fullScreen = false,
}: ErrorStateProps) {
  const navigate = useNavigate();

  let defaultHeading = 'Something went wrong';
  let defaultDescription = 'Unable to load your notes.';
  let icon = <AlertCircle className="w-8 h-8" />;
  let iconBgColor = 'bg-red-50 dark:bg-red-950/60 text-[#EF4444] dark:text-red-400';

  if (type === 'permission') {
    defaultHeading = 'Access denied';
    defaultDescription = "You don't have permission to access this resource.";
    icon = <ShieldAlert className="w-8 h-8" />;
    iconBgColor = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400';
  } else if (type === '404') {
    defaultHeading = 'Page not found';
    defaultDescription = "The page you're looking for doesn't exist.";
    icon = <FileQuestion className="w-8 h-8" />;
    iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]';
  }

  const finalHeading = heading || defaultHeading;
  const finalDescription = description || defaultDescription;

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/dashboard');
    }
  };

  const content = (
    <div
      id={`error-state-${type}`}
      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-8 sm:p-12 text-center space-y-5 shadow-2xs transition-colors duration-200 max-w-md mx-auto"
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-2xs ${iconBgColor}`}
      >
        {icon}
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          {finalHeading}
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
          {finalDescription}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {type === 'network' && (
          <>
            {onRetry && (
              <Button
                variant="primary"
                size="md"
                onClick={onRetry}
                className="gap-2 font-semibold"
                id="error-state-retry-btn"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={handleGoHome}
              className="gap-2 font-semibold"
              id="error-state-home-btn"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button>
          </>
        )}

        {type === 'permission' && (
          <Button
            variant="primary"
            size="md"
            onClick={handleGoHome}
            className="gap-2 font-semibold"
            id="error-state-permission-home-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        )}

        {type === '404' && (
          <Button
            variant="primary"
            size="md"
            onClick={handleGoHome}
            className="gap-2 font-semibold"
            id="error-state-404-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center justify-center p-4 transition-colors duration-200">
        {content}
      </div>
    );
  }

  return content;
}
