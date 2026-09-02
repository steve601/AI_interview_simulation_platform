import React from 'react';

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  showPercent?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  label = 'Round Progress',
  showPercent = true
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((currentStep / totalSteps) * 100))
  );

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium text-[#334155]">
        <span>{label}</span>
        {showPercent && (
          <span className="font-mono text-[#2563EB] font-bold">
            {currentStep} / {totalSteps} ({percentage}%)
          </span>
        )}
      </div>

      <div className="w-full bg-[#E2E8F0] h-2 rounded-xs overflow-hidden">
        <div
          className="bg-[#2563EB] h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
