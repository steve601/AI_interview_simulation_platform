/**
 * Type definitions mirroring the backend Pydantic models.
 * These MUST match backend/models/*.py field name exactly.
 *
 * These are also re-exported from types/index.ts for convenience.
 */

export interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ApiError extends Error {
  status?: number;
  detail?: string;
}

