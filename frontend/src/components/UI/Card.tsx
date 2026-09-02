import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer
}) => {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-sm shadow-2xs overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#FAFAFA] flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#FAFAFA] text-xs text-[#64748B]">{footer}</div>}
    </div>
  );
};
