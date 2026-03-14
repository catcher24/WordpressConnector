import { TargetType, PortType } from './enums';
import { VulnerabilityModel } from './vulnerability';

export { TargetType, PortType }; // re-export so callers who import from target.ts still work

export const getTargetTypeDisplayName = (targetType: TargetType, options?: { plural?: boolean }): string => {
  const methodDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Device',
    [TargetType.WebApplication]: 'Web Application',
  };

  const pluralDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Devices',
    [TargetType.WebApplication]: 'Web Applications',
  };

  const isPlural = options?.plural;
  return isPlural ? pluralDisplayNames[targetType] : methodDisplayNames[targetType];
};

export const getTargetTypeColor = (targetType: TargetType): string => {
  const colors: { [key in TargetType]: string } = {
    [TargetType.Host]: '#0a454f',
    [TargetType.WebApplication]: '#c3b251',
  };
  return colors[targetType] || '#6c757d';
};

export const getSeverityLabel = (severity: number): string => {
  if (severity >= 9) return 'Critical';
  if (severity >= 7) return 'High';
  if (severity >= 4) return 'Medium';
  if (severity >= 0.1) return 'Low';
  return 'Noise';
};

export const getSeverityColor = (severity: number): { bg: string; text: string; light: string; border: string } => {
  if (severity >= 9) return { bg: 'bg-severity-critical', text: 'text-severity-critical-dark', light: 'bg-severity-critical-light', border: 'border-severity-critical-dark/20' };
  if (severity >= 7) return { bg: 'bg-severity-high', text: 'text-severity-high-dark', light: 'bg-severity-high-light', border: 'border-severity-high-dark/20' };
  if (severity >= 4) return { bg: 'bg-severity-medium', text: 'text-severity-medium-dark', light: 'bg-severity-medium-light', border: 'border-severity-medium-dark/20' };
  if (severity >= 0.1) return { bg: 'bg-severity-low', text: 'text-severity-low-dark', light: 'bg-severity-low-light', border: 'border-severity-low-dark/20' };
  return { bg: 'bg-severity-noise', text: 'text-severity-noise-dark', light: 'bg-severity-noise-light', border: 'border-severity-noise-dark/20' };
};

export interface SeverityModel {
  critical: number;
  high: number;
  medium: number;
  low: number;
  noise: number;
}

export interface TargetPortModel {
  type: PortType;
  value: number;
  severity: SeverityModel;
  mostSevereVulnerability: VulnerabilityModel;
  vulnerabilityIds: string[];
  silencedVulnerabilityIds: string[];
  assetVersionIds: string[];
}

export interface TargetModel {
  id: string;
  tenantId: string;
  organizationId: string;
  type: TargetType;
  ip?: string;
  hostname?: string;
  displayName?: string;
  preferredDisplayName: string;
  assetCount: number;
  detectionCount: number;
  /** ScannerConfigurationModel[] from the API – typed as any[] since it's rarely used */
  scannerConfigurations: any[];
  severity: SeverityModel;
  mostSevereVulnerability?: VulnerabilityModel;
  scheduledForDeletionAt?: string;
  portCount: number;
}
