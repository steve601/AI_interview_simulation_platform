import { API_ENDPOINTS } from '../config';

import {
  InterviewPlanBackend,
  FeedbackResponseBackend,
  ApiError,
} from '../types';

function toApiError(
  err: unknown,
  defaultDetail: string
): ApiError {
  if (err instanceof Error) {
    const original =
      err as ApiError;

    const message =
      original.detail ||
      original.message ||
      defaultDetail;

    const error: ApiError =
      new Error(message);

    error.status =
      original.status;

    error.detail =
      original.detail ||
      defaultDetail;

    return error;
  }

  const error: ApiError =
    new Error(defaultDetail);

  error.detail = defaultDetail;

  return error;
}

async function handleResponse(
  resp: Response,
  defaultDetail: string
): Promise<unknown> {
  if (!resp.ok) {
    let detail =
      defaultDetail;

    try {
      const body =
        await resp.json();

      if (
        body &&
        typeof body.detail === 'string'
      ) {
        detail = body.detail;
      }
    } catch {
      try {
        const text =
          await resp.text();

        if (text) {
          detail = text;
        }
      } catch {
        // Keep default detail.
      }
    }

    const error: ApiError =
      new Error(
        `API error ${resp.status}: ${detail}`
      );

    error.status =
      resp.status;

    error.detail = detail;

    throw error;
  }

  try {
    return await resp.json();
  } catch {
    const error: ApiError =
      new Error(
        'The server returned an invalid JSON response.'
      );

    error.status =
      resp.status;

    error.detail =
      'The server returned an invalid JSON response.';

    throw error;
  }
}

export const api = {
  /**
   * Generate interview plan.
   *
   * POST /api/analysis/generate-plan
   *
   * multipart/form-data:
   *   cv_file
   *   job_description
   */
  async generatePlan(
    cvFile: File,
    jobDescription: string
  ): Promise<InterviewPlanBackend> {
    try {
      if (!cvFile) {
        throw new Error(
          'CV file is required.'
        );
      }

      if (!jobDescription.trim()) {
        throw new Error(
          'Job description is required.'
        );
      }

      const form =
        new FormData();

      form.append(
        'cv_file',
        cvFile
      );

      form.append(
        'job_description',
        jobDescription
      );

      const resp =
        await fetch(
          API_ENDPOINTS.generatePlan,
          {
            method: 'POST',
            body: form,
          }
        );

      return (await handleResponse(
        resp,
        'Failed to generate interview plan.'
      )) as InterviewPlanBackend;
    } catch (err) {
      throw toApiError(
        err,
        'Failed to generate interview plan.'
      );
    }
  },

  /**
   * Start interview.
   *
   * POST /api/interview/start
   */
  async startInterview(
    threadId: string
  ): Promise<{
    status: string;
    thread_id: string;
    question: string | null;
  }> {
    try {
      if (!threadId.trim()) {
        throw new Error(
          'Interview thread ID is required.'
        );
      }

      const resp =
        await fetch(
          API_ENDPOINTS.startInterview,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              thread_id:
                threadId,
            }),
          }
        );

      return (await handleResponse(
        resp,
        'Failed to start interview.'
      )) as {
        status: string;
        thread_id: string;
        question: string | null;
      };
    } catch (err) {
      throw toApiError(
        err,
        'Failed to start interview.'
      );
    }
  },

  /**
   * Submit candidate answer.
   *
   * POST /api/interview/answer
   */
  async submitAnswer(
    threadId: string,
    answer: string
  ): Promise<{
    status: string;
    thread_id: string;
    question: string | null;
  }> {
    try {
      if (!threadId.trim()) {
        throw new Error(
          'Interview thread ID is required.'
        );
      }

      if (!answer.trim()) {
        throw new Error(
          'Answer cannot be empty.'
        );
      }

      const resp =
        await fetch(
          API_ENDPOINTS.submitAnswer,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              thread_id:
                threadId,
              answer:
                answer.trim(),
            }),
          }
        );

      return (await handleResponse(
        resp,
        'Failed to submit answer.'
      )) as {
        status: string;
        thread_id: string;
        question: string | null;
      };
    } catch (err) {
      throw toApiError(
        err,
        'Failed to submit answer.'
      );
    }
  },

  /**
   * Move to next interview round.
   *
   * POST /api/interview/next-round
   */
  async nextRound(
    threadId: string
  ): Promise<{
    status: string;
    thread_id: string;
    question?: string | null;
  }> {
    try {
      if (!threadId.trim()) {
        throw new Error(
          'Interview thread ID is required.'
        );
      }

      const resp =
        await fetch(
          API_ENDPOINTS.nextRound,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              thread_id:
                threadId,
            }),
          }
        );

      return (await handleResponse(
        resp,
        'Failed to move to next round.'
      )) as {
        status: string;
        thread_id: string;
        question?: string | null;
      };
    } catch (err) {
      throw toApiError(
        err,
        'Failed to move to next round.'
      );
    }
  },

  /**
   * Retrieve final feedback.
   *
   * GET /api/feedback/{thread_id}
   */
  async getFeedback(
    threadId: string
  ): Promise<FeedbackResponseBackend> {
    try {
      if (!threadId.trim()) {
        throw new Error(
          'Interview thread ID is required.'
        );
      }

      const resp =
        await fetch(
          API_ENDPOINTS.getFeedback(
            threadId
          ),
          {
            method: 'GET',
          }
        );

      return (await handleResponse(
        resp,
        'Failed to retrieve feedback report.'
      )) as FeedbackResponseBackend;
    } catch (err) {
      throw toApiError(
        err,
        'Failed to retrieve feedback report.'
      );
    }
  },
};