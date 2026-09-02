/**
 * Shared utility helpers.
 *
 * NOTE: all demo/sample data (default candidates, job descriptions,
 * interview plans, question banks, sample reports) has been removed.
 * Every piece of interview content now comes from the live backend.
 */

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function formatDate(dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
