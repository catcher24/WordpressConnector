export const getSeverityLabel = (severity: number): string => {
  if (severity >= 9) return 'Critical';
  if (severity >= 7) return 'High';
  if (severity >= 4) return 'Medium';
  if (severity >= 0.1) return 'Low';
  return 'Noise';
};
