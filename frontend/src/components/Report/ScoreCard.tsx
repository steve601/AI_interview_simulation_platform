import React from 'react';
import { Card } from '../UI/Card';
import { Trophy, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export interface ScoreCardProps {
  label: string;
  score: number | null;
  maxScore?: number;
  subtitle?: string;
  isOverall?: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  label,
  score,
  maxScore = 100,
  subtitle,
  isOverall = false
}) => {
  const getBadgeColor = (val: number | null) => {
    if (val === null) return 'text-slate-700 bg-slate-50 border-slate-200';
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <Card
      className={`border-[#CBD5E1] transition-all ${
        isOverall ? 'bg-gradient-to-b from-white to-blue-50/20 border-l-4 border-l-[#2563EB]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            {label}
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold font-mono text-[#0F172A] tracking-tight">
              {score ?? 'N/A'}
            </span>
            <span className="text-xs text-[#64748B] font-mono">/ {maxScore}</span>
          </div>
          {subtitle && <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>}
        </div>

        <div
          className={`px-2.5 py-1 rounded-xs border text-xs font-bold font-mono ${getBadgeColor(
            score
          )}`}
        >
          {score === null ? 'Unavailable' : score >= 85 ? 'Exceeds' : score >= 70 ? 'Meets' : 'Developing'}
        </div>
      </div>
    </Card>
  );
};
