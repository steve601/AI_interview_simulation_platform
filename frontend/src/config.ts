/**
 * Centralized PromptHire API configuration.
 *
 * The base URL for the FastAPI backend is resolved at build time
 * via Vite's `VITE_API_URL` environment variable. In local
 * development it defaults to http://localhost:8000.
 *
 * IMPORTANT: only the VITE_API_URL (a non-secret origin) ever
 * reaches the client bundle. Secrets must stay server-side.
 */
const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

export const getApiBaseUrl = (): string => API_BASE_URL;

export const API_ENDPOINTS = {
  generatePlan: `${API_BASE_URL}/api/analysis/generate-plan`,
  startInterview: `${API_BASE_URL}/api/interview/start`,
  submitAnswer: `${API_BASE_URL}/api/interview/answer`,
  nextRound: `${API_BASE_URL}/api/interview/next-round`,
  getFeedback: (threadId: string) =>
    `${API_BASE_URL}/api/feedback/${threadId}`,
} as const;