import React from 'react';
import { Card } from '../UI/Card';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export interface FeedbackCardProps {
  title: string;
  strengths: string[];
  improvements: string[];
  executiveSummary?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  title,
  strengths,
  improvements,
  executiveSummary
}) => {
  return (
    <Card title={title} className="border-[#CBD5E1]">
      <div className="space-y-4">
        {executiveSummary && (
          <div className="p-3.5 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xs text-sm text-[#1E293B] font-serif leading-relaxed">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
              Executive Evaluation Summary
            </span>
            {executiveSummary}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Validated Strengths</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Growth & Probing Areas</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {improvements.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
