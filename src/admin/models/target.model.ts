import { CollectorCollectionMethod, TargetType } from '../enums';
import {ScannerConfigurationModel} from "./scanner-configuration.model";
import {VulnerabilitySummaryModel} from "./vulnerability-summary.model";
import {ScanSummaryModel} from "./scan-summary.model";
import {SeverityModel} from "./severity.model";

export class TargetModel {
  id!: string;
  tenantId!: string;
  organizationId!: string;
  type!: TargetType;
  ip?: string;
  hostname?: string;
  displayName?: string;
  preferredDisplayName!: string;
  assetCount!: number;
  detectionCount!: number;
  scannerConfigurations!: ScannerConfigurationModel[];
  severity!: SeverityModel;
  mostSevereVulnerability?: VulnerabilitySummaryModel;
  lastScan?: ScanSummaryModel;
  scheduledForDeletionAt?: Date;
  portCount!: number;

  static asTargetModel = (unknownType: unknown) => unknownType as TargetModel;

  static scheduledScannerConfigurations = (targetModel: TargetModel) =>
    targetModel.scannerConfigurations.filter(x => x.collectionMethod === CollectorCollectionMethod.OnSchedule);
}
