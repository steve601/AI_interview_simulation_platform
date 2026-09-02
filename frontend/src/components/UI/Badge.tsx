import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'gray' | 'green' | 'amber' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    gray: 'bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]',
    green: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    amber: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    red: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-xs whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
