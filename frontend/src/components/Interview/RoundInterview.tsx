/**
 * Shared live-interview screen used by all three interview rounds.
 *
 * Talks to the real backend via the SSE streaming hook:
 *  - Round 1 (behavioral):  POST /api/interview/start     (resumes the analysis gate)
 *  - Rounds 2/3:            POST /api/interview/next-round (resumes the round transition)
 *  - Every answer:          POST /api/interview/answer     (resumes the answer gate)
 *
 * The interviewer's questions are streamed token-by-token into a
 * transcript. Questions per round come from the generated interview
 * plan (interview_plan.*.number_of_questions) — no hardcoded banks.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { useInterviewStream } from '../../hooks/useInterviewStream';
import { AnswerCard } from './AnswerCard';
import { ProgressBar } from '../Progress/ProgressBar';
import { Breadcrumb } from '../Common/Breadcrumb';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { RoundType } from '../../types';
import {
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

/** Module-level guard: each (thread, round) starts its stream exactly once. */
const startedRounds = new Set<string>();

export interface RoundInterviewProps {
  roundType: RoundType;
  /** Key into the backend interview plan object for this round. */
  planKey: 'behavioral' | 'technical' | 'system_design';
  title: string;
  subtitle: string;
  progressLabel: string;
  roundNumber: number;
  /** Route of the next stage; omit on the final round. */
  nextPath?: string;
  nextLabel?: string;
}

export const RoundInterview: React.FC<RoundInterviewProps> = ({
  roundType,
  planKey,
  title,
  subtitle,
  progressLabel,
  roundNumber,
  nextPath,
  nextLabel,
}) => {
  const {
    threadId,
    interviewPlan,
    interviewMessages,
    setCurrentRound,
    setRoundProgress,
    isLoadingInterview,
    isSubmitting,
    apiError,
    navigate,
  } = useInterview();

  const { startInterview, submitAnswer, triggerNextRound } = useInterviewStream();

  // Snapshot where this round's transcript begins in the shared message list.
  const [roundStartIndex] = useState(() => interviewMessages.length);
  const startedRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Questions in this round come straight from the generated plan.
  const questionsInRound = useMemo<number>(() => {
    if (!interviewPlan) return 0;
    return interviewPlan[planKey]?.number_of_questions ?? 0;
  }, [interviewPlan, planKey]);

  const visibleMessages = useMemo(
    () => interviewMessages.slice(roundStartIndex),
    [interviewMessages, roundStartIndex]
  );

  const answersSubmitted = useMemo(
    () => visibleMessages.filter((m) => m.role === 'user').length,
    [visibleMessages]
  );

  useEffect(() => {
    if (questionsInRound === 0) return;

    setRoundProgress((previous) => ({
      ...previous,
      [roundType]: {
        ...previous[roundType],
        answeredCount: Math.min(answersSubmitted, questionsInRound),
        totalCount: questionsInRound,
        completed: answersSubmitted >= questionsInRound,
      },
    }));
  }, [answersSubmitted, questionsInRound, roundType, setRoundProgress]);

  const busy = isLoadingInterview || isSubmitting;

  const roundComplete =
    startedRef.current &&
    !busy &&
    !apiError &&
    questionsInRound > 0 &&
    answersSubmitted >= questionsInRound;

  // Kick off the round's first interviewer question exactly once.
  useEffect(() => {
    if (!threadId) {
      navigate('/plan');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const key = `${threadId}:${roundType}`;
    if (startedRounds.has(key)) return; // StrictMode double-mount safety
    startedRounds.add(key);

    setCurrentRound(roundType);
    if (roundType === 'behavioral') {
      startInterview(threadId);
    } else {
      // Entering rounds 2/3 resumes the backend's round-transition interrupt.
      triggerNextRound(threadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  // Keep the latest transcript entry in view while streaming.
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [visibleMessages.length]);

  const handleSubmitAnswer = (answerText: string) => {
    if (!threadId) return;
    submitAnswer(threadId, answerText);
  };

  const handleContinue = () => {
    if (!nextPath) return;
    if (nextPath === '/interview/technical') setCurrentRound('technical');
    else if (nextPath === '/interview/system-design') setCurrentRound('system-design');
    navigate(nextPath);
  };

  // ---- Guards -------------------------------------------------------
  if (!threadId || !interviewPlan) {
    return (
      <div className="py-12">
        <LoadingSpinner size="lg" label="Preparing interview session..." />
      </div>
    );
  }

  const currentQuestionNumber = Math.min(answersSubmitted + 1, questionsInRound);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#2563EB]" />
            <span>{title}</span>
          </h1>
          <p className="text-xs text-[#64748B]">{subtitle}</p>
        </div>

        <div className="w-full sm:w-64">
          <ProgressBar
            currentStep={currentQuestionNumber}
            totalSteps={questionsInRound}
            label={progressLabel}
          />
        </div>
      </div>

      {/* Error banner */}
      {apiError && !busy && (
        <Card className="border-red-300 bg-red-50/60">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900">Connection Issue</h3>
              <p className="text-xs text-red-800 mt-1">{apiError.detail}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Live transcript */}
      <div className="space-y-4">
        {visibleMessages.length === 0 && busy && (
          <LoadingSpinner
            size="md"
            label="Connecting to AI interviewer..."
            subLabel="The interviewer is preparing your first question."
          />
        )}

        {visibleMessages.map((msg, idx) =>
          msg.role === 'assistant' ? (
            <div key={idx} className="flex items-start space-x-2.5">
              <div className="mt-1 p-1.5 bg-blue-50 border border-blue-100 rounded-xs text-[#2563EB] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 p-4 bg-white border border-[#CBD5E1] rounded-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2563EB] block mb-1.5">
                  Interviewer
                </span>
                <p className="text-sm text-[#1E293B] font-serif leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex justify-end">
              <div className="max-w-[85%] p-4 bg-blue-50/70 border border-blue-200 rounded-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 block mb-1.5">
                  Your Response • Q{Math.min(
                    visibleMessages.slice(0, idx + 1).filter((m) => m.role === 'user').length,
                    questionsInRound
                  )}
                </span>
                <p className="text-sm text-[#1E293B] font-serif leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          )
        )}

        {busy && visibleMessages.length > 0 && (
          <div className="flex items-center space-x-2 pl-9">
            <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
            <span className="text-xs text-[#64748B] italic">Interviewer is typing...</span>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Answer input / round completion */}
      {!busy && !apiError && !roundComplete && startedRef.current && (
        <AnswerCard
          onSubmit={handleSubmitAnswer}
          questionNumber={currentQuestionNumber}
          isLastQuestion={currentQuestionNumber >= questionsInRound}
        />
      )}

      {roundComplete && (
        <Card className="border-[#2563EB] bg-gradient-to-b from-white to-blue-50/30 text-center p-8">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase bg-blue-100 text-blue-800 px-3 py-1 rounded-xs font-bold">
            Round {roundNumber} Complete
          </span>

          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight mt-3">
            All {questionsInRound} responses recorded
          </h2>
          <p className="text-sm text-[#334155] font-serif max-w-lg mx-auto mt-2 leading-relaxed">
            Your evaluation for this round has been scored by the assessment engine.
          </p>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {nextLabel ?? 'Continue'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
