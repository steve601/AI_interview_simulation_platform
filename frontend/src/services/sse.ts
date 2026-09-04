/**
 * Server-Sent Events (SSE) streaming utilities.
 *
 * Expected backend format:
 *
 * event: token
 * data: Hello
 *
 * event: done
 * data: true
 *
 * event: error
 * data: Something went wrong
 */

export type SSEEvent =
  | { type: 'token'; data: string }
  | { type: 'done'; data: string }
  | { type: 'error'; data: string };

export interface SSEOptions {
  onEvent: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  connectTimeoutMs?: number;
  signal?: AbortSignal;
}

function dispatchEvent(
  eventType: string,
  eventData: string,
  onEvent: (event: SSEEvent) => void,
  onError?: (error: Error) => void
): boolean {
  if (!eventType) {
    return false;
  }

  const type = eventType as SSEEvent['type'];

  if (type !== 'token' && type !== 'done' && type !== 'error') {
    return false;
  }

  const event: SSEEvent = {
    type,
    data: eventData,
  };

  onEvent(event);

  if (type === 'error') {
    onError?.(new Error(eventData || 'Server returned an SSE error.'));
    return true;
  }

  return type === 'done';
}

export async function streamPOST(
  url: string,
  body: unknown,
  opts: SSEOptions
): Promise<void> {
  const {
    onEvent,
    onError,
    signal,
    connectTimeoutMs = 30000,
  } = opts;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
  };

  let resp: Response;

  /*
   * ------------------------------------------------------------
   * Fetch
   * ------------------------------------------------------------
   */

  try {
    const controller = new AbortController();

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleAbort = () => {
      controller.abort();
    };

    if (signal) {
      if (signal.aborted) {
        return;
      }

      signal.addEventListener('abort', handleAbort, {
        once: true,
      });
    }

    timeoutId = setTimeout(() => {
      controller.abort();
    }, connectTimeoutMs);

    try {
      resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === 'AbortError'
      ) {
        if (signal?.aborted) {
          return;
        }

        onError?.(
          new Error(
            `Connection timed out after ${connectTimeoutMs / 1000} seconds.`
          )
        );

        return;
      }

      onError?.(
        err instanceof Error
          ? err
          : new Error('Failed to connect to the interview server.')
      );

      return;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      signal?.removeEventListener('abort', handleAbort);
    }
  } catch (err) {
    onError?.(
      err instanceof Error
        ? err
        : new Error('Failed to connect to the interview server.')
    );

    return;
  }

  /*
   * ------------------------------------------------------------
   * HTTP response validation
   * ------------------------------------------------------------
   */

  if (!resp.ok) {
    let detail = '';

    try {
      const contentType = resp.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const json = await resp.json();
        detail =
          json?.detail ||
          json?.message ||
          JSON.stringify(json);
      } else {
        detail = await resp.text();
      }
    } catch {
      // Ignore response parsing errors.
    }

    onError?.(
      new Error(
        `Server responded with ${resp.status}${
          detail ? `: ${detail}` : ''
        }`
      )
    );

    return;
  }

  if (!resp.body) {
    onError?.(
      new Error('The server returned an empty streaming response.')
    );

    return;
  }

  /*
   * ------------------------------------------------------------
   * SSE reader
   * ------------------------------------------------------------
   */

  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';
  let currentEventType = '';
  let currentEventData: string[] = [];

  let streamCompleted = false;

  const processEvent = (): boolean => {
    if (!currentEventType) {
      currentEventData = [];
      return false;
    }

    const data = currentEventData.join('\n');

    const shouldStop = dispatchEvent(
      currentEventType,
      data,
      onEvent,
      onError
    );

    currentEventType = '';
    currentEventData = [];

    return shouldStop;
  };

  try {
    while (true) {
      if (signal?.aborted) {
        return;
      }

      const { value, done } = await reader.read();

      /*
       * --------------------------------------------------------
       * Stream closed
       * --------------------------------------------------------
       */

      if (done) {
        /*
         * Process a final event even if the backend did not send
         * the final blank line required by SSE.
         */
        if (currentEventType) {
          streamCompleted = processEvent();

          if (streamCompleted) {
            return;
          }
        }

        /*
         * Process any remaining buffered line.
         */
        if (buffer.trim()) {
          const line = buffer.trim();

          if (line.startsWith('event:')) {
            currentEventType = line
              .slice('event:'.length)
              .trim();
          } else if (line.startsWith('data:')) {
            currentEventData.push(
              line.slice('data:'.length).trim()
            );
          }

          buffer = '';

          if (currentEventType) {
            streamCompleted = processEvent();

            if (streamCompleted) {
              return;
            }
          }
        }

        /*
         * A normal HTTP/SSE stream closure is not automatically
         * an error. The backend may close after producing the
         * final interviewer message.
         */
        if (!streamCompleted) {
          onEvent({
            type: 'done',
            data: 'true',
          });
        }

        return;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      /*
       * Normalize CRLF / CR into LF.
       */
      buffer = buffer.replace(/\r\n/g, '\n');
      buffer = buffer.replace(/\r/g, '\n');

      const lines = buffer.split('\n');

      /*
       * Keep incomplete final line.
       */
      buffer = lines.pop() ?? '';

      for (const rawLine of lines) {
        const line = rawLine;

        /*
         * Blank line = end of SSE event.
         */
        if (line.trim() === '') {
          const shouldStop = processEvent();

          if (shouldStop) {
            return;
          }

          continue;
        }

        /*
         * SSE comments / keep-alive.
         */
        if (line.startsWith(':')) {
          continue;
        }

        /*
         * event: token
         */
        if (line.startsWith('event:')) {
          currentEventType = line
            .slice('event:'.length)
            .trim();

          continue;
        }

        /*
         * data: some text
         */
        if (line.startsWith('data:')) {
          currentEventData.push(
            line.slice('data:'.length).trim()
          );

          continue;
        }
      }
    }
  } catch (err) {
    if (
      err instanceof DOMException &&
      err.name === 'AbortError'
    ) {
      return;
    }

    if (signal?.aborted) {
      return;
    }

    onError?.(
      err instanceof Error
        ? err
        : new Error('SSE streaming failed.')
    );
  } finally {
    reader.releaseLock();
  }
}
