import { TargetType, CollectorStatus } from './enums';

export { CollectorStatus }; // re-export for backward compat

export interface CollectorSpecializationModel {
  id: string;
  name: string;
  displayName: string;
  requiredProtocols: string[];
  requiredCpes: string[];
  averageDuration: string;
  timeoutDuration: string;
  defaultConfigurationSettings: Record<string, string>;
}

/** Individual scanning tool with its own name and capabilities. */
export interface CollectorModel {
  id: string;
  name: string;
  displayName: string;
  dependsOn: string[];
  isSpecializedOnly: boolean;
  averageDuration: string;
  timeoutDuration: string;
  defaultConfigurationSettings: Record<string, string>;
  collectorSpecializations: CollectorSpecializationModel[];
}

/**
 * A named group of collectors that defines a scan strategy.
 * The collectorGroup.name is the human-readable scan name shown in the UI.
 */
export interface CollectorGroupModel {
  id: string;
  name: string;
  description: string;
  targetType: TargetType;
  collectorIds: string[];
  defaultConfiguration: Record<string, string>;
}

/**
 * Binds a CollectorGroup to a target.
 * ScanModel.scannerId → ScannerModel.id → ScannerModel.collectorGroupId → CollectorGroupModel.name
 */
export interface ScannerModel {
  id: string;
  collectorGroupId: string;
}

/** A single collector run within a scan. collectorId maps to CollectorModel.id. */
export interface ScanRunnerModel {
  collectorId: string;
  collectorSpecializationId?: string;
  progression: number | null;
  startedAt: string | null;
  endedAt: string | null;
  collectorType: number;
  collectorStatus: CollectorStatus | number;
  configuration: Record<string, string>;
}

export interface ScanModel {
  id: string;
  tenantId: string;
  organizationId: string;
  /** Links to ScannerModel.id → CollectorGroupModel.name for the scan display name */
  scannerId: string;
  targetId: string;
  targetType: TargetType;
  startedAt: string;
  endedAt?: string;
  runners: ScanRunnerModel[];
}
