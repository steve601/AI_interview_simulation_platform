/**
 * Custom hook for managing SSE streaming interview sessions.
 *
 * Wraps the backend's /interview/start, /interview/answer, and
 * /interview/next-round SSE endpoints with progressive token
 * accumulation, error handling, and abort support.
 */
import { useRef, useCallback } from 'react';
import { useInterview } from "../context/InterviewContext";
import { api } from '../services/api';
import { ApiError } from '../types';


export const useInterviewStream = () => {
  const {
    appendMessage,
    setIsLoadingInterview,
    setIsSubmitting,
    addToast,
    setApiError,
  } = useInterview();

  // AbortController gives us a way to cancel the stream on unmount
  // or when the user submits a new answer.
  const abortRef = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const startInterview = useCallback(
    (threadId: string) => {
      cleanup();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingInterview(true);
      setApiError(null);

      let accumulatedText = '';

      api.startInterview(
        threadId,
        (token) => {
          accumulatedText += token;
        },
        () => {
          // Done — flush accumulated message as assistant
          if (accumulatedText.trim()) {
            appendMessage({ role: 'assistant', content: accumulatedText.trim() });
          }
          accumulatedText = '';
          setIsLoadingInterview(false);
        },
        (err: ApiError) => {
          setApiError(err);
          setIsLoadingInterview(false);
          addToast({
            type: 'error',
            title: 'Connection Error',
            message: err.detail || 'Failed to start interview session.',
          });
        },
        controller.signal
      );
    },
    [appendMessage, setIsLoadingInterview, setApiError, addToast, cleanup]
  );

  const submitAnswer = useCallback(
    (threadId: string, answer: string) => {
      cleanup();
      const controller = new AbortController();
      abortRef.current = controller;

      // Add the user's answer immediately
      appendMessage({ role: 'user', content: answer });
      setIsSubmitting(true);
      setApiError(null);

      let accumulatedText = '';

      api.submitAnswer(
        threadId,
        answer,
        (token) => {
          accumulatedText += token;
        },
        () => {
          if (accumulatedText.trim()) {
            appendMessage({ role: 'assistant', content: accumulatedText.trim() });
          }
          accumulatedText = '';
          setIsSubmitting(false);
        },
        (err: ApiError) => {
          setApiError(err);
          setIsSubmitting(false);
          addToast({
            type: 'error',
            title: 'Answer Submission Error',
            message: err.detail || 'Failed to submit your answer.',
          });
        },
        controller.signal
      );
    },
    [appendMessage, setIsSubmitting, setApiError, addToast, cleanup]
  );

  const triggerNextRound = useCallback(
    (threadId: string) => {
      cleanup();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingInterview(true);
      setApiError(null);

      let accumulatedText = '';

      api.nextRound(
        threadId,
        (token) => {
          accumulatedText += token;
        },
        () => {
          if (accumulatedText.trim()) {
            appendMessage({ role: 'assistant', content: accumulatedText.trim() });
          }
          accumulatedText = '';
          setIsLoadingInterview(false);
        },
        (err: ApiError) => {
          setApiError(err);
          setIsLoadingInterview(false);
          addToast({
            type: 'error',
            title: 'Round Transition Error',
            message: err.detail || 'Failed to start the next round.',
          });
        },
        controller.signal
      );
    },
    [appendMessage, setIsLoadingInterview, setApiError, addToast, cleanup]
  );

  return { startInterview, submitAnswer, triggerNextRound, cleanup };
};
