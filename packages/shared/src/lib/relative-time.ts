// `numeric: 'auto'` produces natural language like "yesterday", "just now"
// instead of always using numbers like "1 day ago", "0 seconds ago".
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// Each entry is [unit name, seconds in that unit], ordered largest-first.
// The loop picks the first unit where the diff is large enough to express,
// e.g. 7200s → 2 hours, 90s → 2 minutes, 30s → 30 seconds.
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1],
];

/**
 * Formats an ISO date string as a human-readable relative time (e.g. "3 days ago", "just now").
 * Uses the browser-native Intl.RelativeTimeFormat — no external dependencies.
 */
export function formatRelativeTime(dateStr: string): string {
  // Negative = past, positive = future
  const diffSeconds = Math.round((new Date(dateStr).getTime() - Date.now()) / 1000);

  for (const [unit, threshold] of UNITS) {
    if (Math.abs(diffSeconds) >= threshold) {
      // Divide to convert seconds into the target unit, e.g. 7200s / 3600 = 2 hours.
      // rtf.format handles sign: negative values produce "ago", positive produce "in".
      return rtf.format(Math.round(diffSeconds / threshold), unit);
    }
  }

  // Less than 1 second difference — renders as "now"
  return rtf.format(0, 'second');
}
