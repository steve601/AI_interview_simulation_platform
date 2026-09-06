import { API_ENDPOINTS } from '../config';
import {
  InterviewPlanBackend,
  FeedbackResponseBackend,
  ApiError,
} from '../types';

/**
 * Normalise fetch / backend errors.
 */
function toApiError(err: unknown, defaultDetail: string): ApiError {
  if (err instanceof Error) {
    const e: ApiError = new Error(
      (err as ApiError).detail || defaultDetail
    );

    e.status = (err as ApiError).status;
    e.detail = (err as ApiError).detail || defaultDetail;

    return e;
  }

  const e: ApiError = new Error(defaultDetail);
  e.detail = defaultDetail;

  return e;
}

async function handleResponse(
  resp: Response,
  defaultDetail: string
): Promise<unknown> {
  if (!resp.ok) {
    let detail = defaultDetail;

    try {
      const body = await resp.json();
      detail = body?.detail || defaultDetail;
    } catch {
      const text = await resp.text().catch(() => '');

      if (text) {
        detail = text;
      }
    }

    const e: ApiError = new Error(
      `API error ${resp.status}: ${detail}`
    );

    e.status = resp.status;
    e.detail = detail;

    throw e;
  }

  return resp.json();
}

export const api = {
  /**
   * Generate interview plan.
   */
  async generatePlan(
    cvFile: File,
    jobDescription: string
  ): Promise<InterviewPlanBackend> {
    const form = new FormData();

    form.append('cv_file', cvFile);
    form.append('job_description', jobDescription);

    const resp = await fetch(API_ENDPOINTS.generatePlan, {
      method: 'POST',
      body: form,
    });

    return (await handleResponse(
      resp,
      'Failed to generate interview plan.'
    )) as InterviewPlanBackend;
  },

  /**
   * Start interview.
   *
   * Backend returns normal JSON:
   *
   * {
   *   status: "success",
   *   thread_id: "...",
   *   question: "Tell me about yourself..."
   * }
   */
  async startInterview(
    threadId: string
  ): Promise<{ status: string; thread_id: string; question: string | null }> {
    try {
      const resp = await fetch(API_ENDPOINTS.startInterview, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
        }),
      });

      return (await handleResponse(
        resp,
        'Failed to start interview.'
      )) as {
        status: string;
        thread_id: string;
        question: string | null;
      };
    } catch (err) {
      throw toApiError(err, 'Failed to start interview.');
    }
  },

  /**
   * Submit candidate answer.
   *
   * Backend returns normal JSON containing the next question.
   */
  async submitAnswer(
    threadId: string,
    answer: string
  ): Promise<{ status: string; thread_id: string; question: string | null }> {
    try {
      const resp = await fetch(API_ENDPOINTS.submitAnswer, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          answer,
        }),
      });

      return (await handleResponse(
        resp,
        'Failed to submit answer.'
      )) as {
        status: string;
        thread_id: string;
        question: string | null;
      };
    } catch (err) {
      throw toApiError(err, 'Failed to submit answer.');
    }
  },

  /**
   * Move to the next interview round.
   *
   * Keep this normal JSON as well if your backend endpoint
   * is no longer using SSE.
   */
  async nextRound(
    threadId: string
  ): Promise<{ status: string; thread_id: string; question?: string | null }> {
    try {
      const resp = await fetch(API_ENDPOINTS.nextRound, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
        }),
      });

      return (await handleResponse(
        resp,
        'Failed to move to next round.'
      )) as {
        status: string;
        thread_id: string;
        question?: string | null;
      };
    } catch (err) {
      throw toApiError(err, 'Failed to move to next round.');
    }
  },

  /**
   * Retrieve final feedback.
   */
  async getFeedback(
    threadId: string
  ): Promise<FeedbackResponseBackend> {
    const resp = await fetch(
      API_ENDPOINTS.getFeedback(threadId),
      {
        method: 'GET',
      }
    );

    return (await handleResponse(
      resp,
      'Failed to retrieve feedback report.'
    )) as FeedbackResponseBackend;
  },
};