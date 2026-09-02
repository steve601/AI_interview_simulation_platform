import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Textarea } from '../UI/Textarea';
import { countWords } from '../../utils';
import { Save, Send, Sparkles, Check, FileEdit } from 'lucide-react';

export interface AnswerCardProps {
  initialAnswer?: string;
  onSubmit: (answerText: string) => void;
  isLastQuestion?: boolean;
  questionNumber: number;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  initialAnswer = '',
  onSubmit,
  isLastQuestion = false,
  questionNumber
}) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setAnswer(initialAnswer);
    setIsSaved(false);
  }, [initialAnswer, questionNumber]);

  const wordCount = countWords(answer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    onSubmit(answer);
    setIsSaved(true);
  };

  const handleInsertSampleStructure = () => {
    const template = `1. Context & Challenge:
[Describe the situation, system scale, or problem scope]

2. Action & Technical Strategy:
[Detail your specific architecture, implementation, or leadership decisions]

3. Outcome & Business Impact:
[Quantify results: e.g. latency reduced by 35%, zero downtime, consensus achieved]`;
    setAnswer((prev) => (prev ? `${prev}\n\n${template}` : template));
  };

  return (
    <Card className="border-[#CBD5E1]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center space-x-1.5">
            <FileEdit className="w-4 h-4 text-[#2563EB]" />
            <span>Candidate Response & Defense</span>
          </label>

          <div className="flex items-center space-x-3 text-xs">
            <button
              type="button"
              onClick={handleInsertSampleStructure}
              className="text-[#2563EB] hover:underline flex items-center space-x-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insert STAR/STAR-T Template</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className={`font-mono ${wordCount < 20 ? 'text-slate-500' : 'text-emerald-700 font-semibold'}`}>
              Word count: {wordCount} words
            </span>
          </div>
        </div>

        <Textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setIsSaved(false);
          }}
          placeholder="Type your structured response here... (Recommended length: 80 - 300 words). Include concrete architectural choices, trade-offs, and metrics where applicable."
          rows={8}
          className="font-serif text-base leading-relaxed p-4"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[#64748B]">
            Responses are automatically evaluated against enterprise competence rubrics.
          </p>

          <div className="flex items-center space-x-2">
            {isSaved && (
              <span className="text-xs text-emerald-700 flex items-center space-x-1 font-medium">
                <Check className="w-4 h-4" />
                <span>Response Recorded</span>
              </span>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={!answer.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              {isLastQuestion ? 'Submit & Finalize Round' : 'Submit & Proceed'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
