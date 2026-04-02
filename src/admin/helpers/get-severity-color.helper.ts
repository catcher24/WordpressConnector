export const getSeverityColor = (severity: number): { bg: string; text: string; light: string; border: string } => {
  if (severity >= 9) return { bg: 'bg-severity-critical', text: 'text-severity-critical-dark', light: 'bg-severity-critical-light', border: 'border-severity-critical-dark/20' };
  if (severity >= 7) return { bg: 'bg-severity-high', text: 'text-severity-high-dark', light: 'bg-severity-high-light', border: 'border-severity-high-dark/20' };
  if (severity >= 4) return { bg: 'bg-severity-medium', text: 'text-severity-medium-dark', light: 'bg-severity-medium-light', border: 'border-severity-medium-dark/20' };
  if (severity >= 0.1) return { bg: 'bg-severity-low', text: 'text-severity-low-dark', light: 'bg-severity-low-light', border: 'border-severity-low-dark/20' };
  return { bg: 'bg-severity-noise', text: 'text-severity-noise-dark', light: 'bg-severity-noise-light', border: 'border-severity-noise-dark/20' };
};
