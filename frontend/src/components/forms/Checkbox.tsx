import { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
}

export function Checkbox({ label, description, className = '', id, ...props }: CheckboxProps) {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex items-start gap-2.5 select-none">
      <div className="flex items-center h-5 mt-0.5">
        <input
          id={checkboxId}
          type="checkbox"
          className={`w-4 h-4 rounded border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#6366F1] dark:text-[#818CF8] focus:ring-[#6366F1] focus:ring-offset-0 focus:ring-2 accent-[#6366F1] dark:accent-[#818CF8] cursor-pointer transition-colors ${className}`}
          {...props}
        />
      </div>
      <div className="text-sm leading-none">
        <label htmlFor={checkboxId} className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer">
          {label}
        </label>
        {description && <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1">{description}</p>}
      </div>
    </div>
  );
}
