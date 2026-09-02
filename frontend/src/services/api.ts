/**
 * Real PromptHire API client.
 *
 * All endpoints mirror the FastAPI backend in backend/api/routes/.
 * No mock data, no simulated delays — every call hits the live
 * backend. The existing visual design is preserved by the
 * consuming components.
 */

import { API_ENDPOINTS } from '../config';
import {
  InterviewPlanBackend,
  FeedbackResponseBackend,
  ApiError,
} from '../types';
import { streamPOST } from './sse';

/**
 * Normalise fetch / backend errors into a clean ApiError without
 * leaking Python stack traces to the UI.
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
      if (text) detail = text;
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
   * Upload a CV (PDF) and a Job Description to the backend's
   * `/api/analysis/generate-plan` endpoint. The LangGraph graph
   * performs CV analysis, JD analysis, gap analysis and interview
   * planning, then pauses at the analysis gate.
   *
   * Returns the full set of backend results + a thread_id that
   * must be reused for all subsequent interview calls.
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
   * Start the interview (resume from the analysis gate interrupt).
   * Streams the first interviewer question token-by-token.
   */
  startInterview(
    threadId: string,
    onToken: (text: string) => void,
    onDone: () => void,
    onError: (err: ApiError) => void,
    signal?: AbortSignal
  ): void {
    streamPOST(
      API_ENDPOINTS.startInterview,
      { thread_id: threadId },
      {
        onEvent: (ev) => {
          if (ev.type === 'token') onToken(ev.data);
          else if (ev.type === 'done') onDone();
          else if (ev.type === 'error') {
            onError(toApiError(new Error(ev.data), ev.data));
          }
        },
        onError: (err) =>
          onError(toApiError(err, 'Failed to start interview.')),
        signal,
      }
    );
  },

  /**
   * Submit the candidate's answer and stream the next interviewer
   * response token-by-token.
   */
  submitAnswer(
    threadId: string,
    answer: string,
    onToken: (text: string) => void,
    onDone: () => void,
    onError: (err: ApiError) => void,
    signal?: AbortSignal
  ): void {
    streamPOST(
      API_ENDPOINTS.submitAnswer,
      { thread_id: threadId, answer },
      {
        onEvent: (ev) => {
          if (ev.type === 'token') onToken(ev.data);
          else if (ev.type === 'done') onDone();
          else if (ev.type === 'error') {
            onError(toApiError(new Error(ev.data), ev.data));
          }
        },
        onError: (err) =>
          onError(toApiError(err, 'Failed to submit answer.')),
        signal,
      }
    );
  },

  /**
   * Move to the next interview round (resume round-transition interrupt).
   */
  nextRound(
    threadId: string,
    onToken: (text: string) => void,
    onDone: () => void,
    onError: (err: ApiError) => void,
    signal?: AbortSignal
  ): void {
    streamPOST(
      API_ENDPOINTS.nextRound,
      { thread_id: threadId },
      {
        onEvent: (ev) => {
          if (ev.type === 'token') onToken(ev.data);
          else if (ev.type === 'done') onDone();
          else if (ev.type === 'error') {
            onError(toApiError(new Error(ev.data), ev.data));
          }
        },
        onError: (err) =>
          onError(toApiError(err, 'Failed to move to next round.')),
        signal,
      }
    );
  },

  /**
   * Retrieve the final feedback / evaluation report.
   */
  async getFeedback(
    threadId: string
  ): Promise<FeedbackResponseBackend> {
    const resp = await fetch(API_ENDPOINTS.getFeedback(threadId), {
      method: 'GET',
    });
    return (await handleResponse(
      resp,
      'Failed to retrieve feedback report.'
    )) as FeedbackResponseBackend;
  },
};