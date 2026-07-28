import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6366F1] dark:focus-visible:ring-[#818CF8] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';


  const variants = {
    primary:
      'bg-[#6366F1] dark:bg-[#818CF8] hover:bg-[#4F46E5] dark:hover:bg-[#6366F1] text-white shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98]',
    secondary:
      'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm hover:shadow-md hover:shadow-purple-500/20 active:scale-[0.98]',
    outline:
      'bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 border border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white shadow-2xs active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          {children || <span>Loading...</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}


