import { useCallback } from 'react';

import { useInterview } from '../context/InterviewContext';
import { api } from '../services/api';
import { ApiError } from '../types';

type QuestionContent =
  | string
  | Array<{
      type?: string;
      text?: string;
      [key: string]: unknown;
    }>
  | null
  | undefined;

function normaliseQuestion(
  content: QuestionContent
): string {
  if (!content) {
    return '';
  }

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (
          block &&
          typeof block.text === 'string'
        ) {
          return block.text;
        }

        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  return '';
}

export const useInterviewStream = () => {
  const {
    appendMessage,
    setIsLoadingInterview,
    setIsSubmitting,
    addToast,
    setApiError,
  } = useInterview();

  const startInterview = useCallback(
    async (threadId: string) => {
      if (!threadId?.trim()) {
        addToast({
          type: 'error',
          title: 'Invalid Interview Session',
          message:
            'No interview thread ID was provided.',
        });

        return;
      }

      setIsLoadingInterview(true);
      setApiError(null);

      try {
        const result =
          await api.startInterview(
            threadId
          );

        const question =
          normaliseQuestion(
            result.question
          );

        if (!question) {
          throw new Error(
            'The backend returned no interview question.'
          );
        }

        appendMessage({
          role: 'assistant',
          content: question,
        });
      } catch (err) {
        const error =
          err as ApiError;

        setApiError(error);

        addToast({
          type: 'error',
          title: 'Connection Error',
          message:
            error.detail ||
            error.message ||
            'Failed to start interview session.',
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

  const submitAnswer = useCallback(
    async (
      threadId: string,
      answer: string
    ) => {
      const cleanedAnswer =
        answer.trim();

      if (!cleanedAnswer) {
        addToast({
          type: 'warning',
          title: 'Answer Required',
          message:
            'Please provide an answer before continuing.',
        });

        return;
      }

      if (!threadId?.trim()) {
        addToast({
          type: 'error',
          title: 'Invalid Interview Session',
          message:
            'No interview thread ID was provided.',
        });

        return;
      }

      /*
       * Show the candidate answer immediately.
       */
      appendMessage({
        role: 'user',
        content: cleanedAnswer,
      });

      setIsSubmitting(true);
      setApiError(null);

      try {
        const result =
          await api.submitAnswer(
            threadId,
            cleanedAnswer
          );

        const question =
          normaliseQuestion(
            result.question
          );

        /*
         * The backend can legitimately return
         * no question when the round has completed.
         *
         * Do NOT treat null/empty question as an
         * API error.
         */
        if (question) {
          appendMessage({
            role: 'assistant',
            content: question,
          });
        }
      } catch (err) {
        const error =
          err as ApiError;

        setApiError(error);

        addToast({
          type: 'error',
          title: 'Answer Submission Error',
          message:
            error.detail ||
            error.message ||
            'Failed to submit your answer.',
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

  const triggerNextRound =
    useCallback(
      async (threadId: string) => {
        if (!threadId?.trim()) {
          addToast({
            type: 'error',
            title: 'Invalid Interview Session',
            message:
              'No interview thread ID was provided.',
          });

          return;
        }

        setIsLoadingInterview(true);
        setApiError(null);

        try {
          const result =
            await api.nextRound(
              threadId
            );

          const question =
            normaliseQuestion(
              result.question
            );

          /*
           * If the backend moves to "completed",
           * there may be no question.
           */
          if (question) {
            appendMessage({
              role: 'assistant',
              content: question,
            });
          }
        } catch (err) {
          const error =
            err as ApiError;

          setApiError(error);

          addToast({
            type: 'error',
            title: 'Round Transition Error',
            message:
              error.detail ||
              error.message ||
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
