import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#334155]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-white border border-[#CBD5E1] rounded-sm px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors resize-y min-h-[120px] ${
          error ? 'border-[#DC2626] focus:ring-[#DC2626]' : ''
        } ${className}`}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-[#64748B]">{helperText}</p>}
      {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
    </div>
  );
};
