/**
 * Formats a duration in seconds as `m:ss` (docs/design/S-7.md decision 15).
 * Only the displayed value is rounded to whole seconds: 5 → "0:05", 60 → "1:00".
 */
export function formatDuration(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds) : 0;
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}
