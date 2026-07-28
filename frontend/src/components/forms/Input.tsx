import { InputHTMLAttributes, useState, ReactNode, forwardRef, useRef, useImperativeHandle, MouseEvent } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    icon: Icon,
    type = 'text',
    helperText,
    rightElement,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const handleTogglePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const inputEl = inputRef.current;

    if (inputEl) {
      const selectionStart = inputEl.selectionStart;
      const selectionEnd = inputEl.selectionEnd;
      const isFocused = document.activeElement === inputEl;

      setShowPassword((prev) => !prev);

      requestAnimationFrame(() => {
        if (isFocused) {
          inputEl.focus();
          if (selectionStart !== null && selectionEnd !== null) {
            try {
              inputEl.setSelectionRange(selectionStart, selectionEnd);
            } catch {
              // Ignore if type doesn't support selection range
            }
          }
        }
      });
    } else {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-[#64748B] dark:text-[#CBD5E1] pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={`w-full bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B]/60 dark:placeholder:text-[#CBD5E1]/50 text-sm rounded-xl border ${
            error
              ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 focus:border-[#EF4444]'
              : 'border-[#E2E8F0] dark:border-[#334155] focus:ring-2 focus:ring-[#6366F1]/20 dark:focus:ring-[#818CF8]/30 focus:border-[#6366F1] dark:focus:border-[#818CF8]'
          } transition-all duration-200 outline-none py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${isPassword || rightElement ? 'pr-10' : 'pr-3.5'} ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] p-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {!isPassword && rightElement && (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[#EF4444] font-medium" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

