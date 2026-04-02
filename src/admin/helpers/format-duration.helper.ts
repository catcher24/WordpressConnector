export const formatDuration = (
  startedAt?: string | Date | number | null,
  endedAt?: string | Date | number | null
): string => {
  if (!startedAt) return "N/A";

  const start = new Date(startedAt).getTime();

  const end = endedAt ? new Date(endedAt).getTime() : Date.now();

  let diffSecs = Math.max(Math.floor((end - start) / 1000), 0);

  const d = Math.floor(diffSecs / 86400);
  diffSecs %= 86400;
  const h = Math.floor(diffSecs / 3600);
  diffSecs %= 3600;
  const m = Math.floor(diffSecs / 60);
  const s = diffSecs % 60;

  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);

  parts.push(`${s}s`);

  return parts.join(' ');
};
