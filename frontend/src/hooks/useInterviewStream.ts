import { useCallback } from 'react';
import { useInterview } from '../context/InterviewContext';
import { api } from '../services/api';
import { ApiError } from '../types';

/**
 * Interview session hook.
 *
 * Uses normal JSON API requests.
 * Streaming/SSE can be added later without changing
 * the RoundInterview component interface.
 */
export const useInterviewStream = () => {
  const {
    appendMessage,
    setIsLoadingInterview,
    setIsSubmitting,
    addToast,
    setApiError,
  } = useInterview();

  /**
   * Start the interview and display the first question.
   */
  const startInterview = useCallback(
    async (threadId: string) => {
      setIsLoadingInterview(true);
      setApiError(null);

      try {
        const result = await api.startInterview(threadId);

        if (result.question && result.question.trim()) {
          appendMessage({
            role: 'assistant',
            content: result.question,
          });
        } else {
          throw new Error('The backend returned no interview question.');
        }
      } catch (err) {
        const error = err as ApiError;

        setApiError(error);

        addToast({
          type: 'error',
          title: 'Connection Error',
          message:
            error.detail || 'Failed to start interview session.',
        });
      } finally {
        setIsLoadingInterview(false);
      }
    },
    [
      appendMessage,
      setIsLoadingInterview,
      setApiError,
      addToast,
    ]
  );

  /**
   * Submit the candidate's answer and display
   * the next interviewer question.
   */
  const submitAnswer = useCallback(
    async (threadId: string, answer: string) => {
      if (!answer.trim()) {
        return;
      }

      // Display candidate's answer immediately.
      appendMessage({
        role: 'user',
        content: answer.trim(),
      });

      setIsSubmitting(true);
      setApiError(null);

      try {
        const result = await api.submitAnswer(
          threadId,
          answer.trim()
        );

        if (result.question && result.question.trim()) {
          appendMessage({
            role: 'assistant',
            content: result.question,
          });
        }
      } catch (err) {
        const error = err as ApiError;

        setApiError(error);

        addToast({
          type: 'error',
          title: 'Answer Submission Error',
          message:
            error.detail || 'Failed to submit your answer.',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      appendMessage,
      setIsSubmitting,
      setApiError,
      addToast,
    ]
  );

  /**
   * Move to the next interview round and display
   * the first question of that round.
   */
  const triggerNextRound = useCallback(
    async (threadId: string) => {
      setIsLoadingInterview(true);
      setApiError(null);

      try {
        const result = await api.nextRound(threadId);

        if (result.question && result.question.trim()) {
          appendMessage({
            role: 'assistant',
            content: result.question,
          });
        } else {
          throw new Error(
            'The backend returned no question for the next round.'
          );
        }
      } catch (err) {
        const error = err as ApiError;

        setApiError(error);

        addToast({
          type: 'error',
          title: 'Round Transition Error',
          message:
            error.detail ||
            'Failed to start the next interview round.',
        });
      } finally {
        setIsLoadingInterview(false);
      }
    },
    [
      appendMessage,
      setIsLoadingInterview,
      setApiError,
      addToast,
    ]
  );

  return {
    startInterview,
    submitAnswer,
    triggerNextRound,
  };
};


