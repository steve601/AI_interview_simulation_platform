import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Processing request...',
  subLabel,
  size = 'md',
  fullScreen = false
}) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div
        className={`${sizeMap[size]} border-[#E2E8F0] border-t-[#2563EB] rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-sm font-semibold text-[#0F172A] tracking-tight">{label}</p>}
      {subLabel && <p className="text-xs text-[#64748B] max-w-sm">{subLabel}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xs flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
