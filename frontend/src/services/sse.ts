/**
 * Server-Sent Events (SSE) streaming utilities.
 *
 * The backend uses `text/event-stream` to push interviewer
 * message tokens progressively. Each event has an `event:` field
 * (`token`, `done`, `error`) and a `data:` payload.
 */

export type SSEEvent =
  | { type: 'token'; data: string }
  | { type: 'done'; data: string }
  | { type: 'error'; data: string };

export interface SSEOptions {
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  /** Maximum time (ms) to wait for the stream to start before erroring. */
  connectTimeoutMs?: number;
  /** AbortSignal to cancel the request externally. */
  signal?: AbortSignal;
}

function parseSSELine(line: string): { event: string; data: string } | null {
  if (line.startsWith('event:')) {
    return { event: 'event', data: line.slice(6).trim() };
  }
  if (line.startsWith('data:')) {
    return { event: 'data', data: line.slice(5).trim() };
  }
  return null;
}

/**
 * Performs a POST to an SSE endpoint and dispatches parsed events.
 * Resolves when a `done` event arrives. Rejects on `error` or network failure.
 */
export async function streamPOST(
  url: string,
  body: unknown,
  opts: SSEOptions
): Promise<void> {
  const { onEvent, onError, signal } = opts;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
  };

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    onError?.(err as Error);
    return;
  }

  if (!resp.ok || !resp.body) {
    const text = await resp.text().catch(() => '');
    const err = new Error(
      `Server responded with ${resp.status}${text ? `: ${text}` : ''}`
    );
    onError?.(err);
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let currentEventField = '';
  let currentEventData = '';

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      // Keep the last partial line in the buffer.
      buffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line === '') {
          // Blank line terminates an event block.
          if (currentEventField && currentEventData) {
            const ev: SSEEvent = { type: currentEventField as SSEEvent['type'], data: currentEventData };
            onEvent(ev);
            if (ev.type === 'done') return;
            if (ev.type === 'error') {
              onError?.(new Error(currentEventData));
              return;
            }
          }
          currentEventField = '';
          currentEventData = '';
          continue;
        }

        const parsed = parseSSELine(line);
        if (!parsed) continue;

        if (parsed.event === 'event') {
          currentEventField = parsed.data;
        } else if (parsed.event === 'data') {
          currentEventData += currentEventData ? '\n' + parsed.data : parsed.data;
        }
      }
    }

    // Stream closed without explicit done — treat as finished.
    if (currentEventField === 'token' && currentEventData) {
      onEvent({ type: 'done', data: 'true' });
    } else {
      onError?.(new Error('Stream connection closed unexpectedly.'));
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    onError?.(err as Error);
  } finally {
    reader.releaseLock();
  }
}
