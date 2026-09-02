import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-sm border';

  const variantStyles = {
    primary:
      'bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white border-transparent focus:ring-[#2563EB] shadow-xs',
    secondary:
      'bg-[#F1F5F9] hover:bg-[#E2E8F0] active:bg-[#CBD5E1] text-[#0F172A] border-[#CBD5E1] focus:ring-[#94A3B8]',
    outline:
      'bg-white hover:bg-[#F8FAFC] active:bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1] focus:ring-[#2563EB] shadow-2xs',
    ghost:
      'bg-transparent hover:bg-[#F1F5F9] active:bg-[#E2E8F0] text-[#334155] border-transparent focus:ring-[#94A3B8]',
    danger:
      'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white border-transparent focus:ring-[#DC2626]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 space-x-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 space-x-2 min-h-[38px]',
    lg: 'text-base px-5 py-2.5 space-x-2.5 min-h-[44px]'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
