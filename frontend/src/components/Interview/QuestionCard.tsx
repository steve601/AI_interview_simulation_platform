import React, { useState } from 'react';
import { Question } from '../../types';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { HelpCircle, Lightbulb, Target } from 'lucide-react';

export interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className="border-[#CBD5E1]">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-[#2563EB] text-white text-xs font-bold font-mono px-2.5 py-1 rounded-xs">
              Question {question.questionNumber} of {question.totalQuestionsInRound}
            </span>
            <Badge variant="blue">{question.category}</Badge>
            <Badge variant="gray">Target Level: {question.difficulty}</Badge>
          </div>

          {question.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center space-x-1 font-medium"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Guidance' : 'View Guidance Hint'}</span>
            </button>
          )}
        </div>

        {/* Question Title & Text */}
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
            {question.title}
          </h2>
          <p className="text-base text-[#1E293B] leading-relaxed font-serif bg-[#FAFAFA] p-4 border-l-4 border-[#2563EB] rounded-xs">
            {question.description}
          </p>
        </div>

        {/* Guidance Hint */}
        {showHint && question.hint && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xs text-xs text-amber-900 flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Interviewer Tip: </span>
              {question.hint}
            </div>
          </div>
        )}

        {/* Expected Focus Areas */}
        {question.expectedFocusAreas && question.expectedFocusAreas.length > 0 && (
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center space-x-1.5 mb-2">
              <Target className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Key Focus Competencies</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {question.expectedFocusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] px-2 py-0.5 rounded-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
