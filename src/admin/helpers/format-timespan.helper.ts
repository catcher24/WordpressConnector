export const formatTimeSpan = (time?: string): string => {
  if (!time) return "0s";
  // Expected C# TimeSpan Format: "d.hh:mm:ss" or "hh:mm:ss"
  const regex = /^(?:(\d+)\.)?(\d+):(\d+):(\d+(?:\.\d+)?)$/;
  const match = time.match(regex);

  if (!match) return time;

  const days = match[1] ? parseInt(match[1], 10) : 0;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const seconds = parseInt(match[4], 10);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.length === 0 ? "0s" : parts.join(" ");
};
