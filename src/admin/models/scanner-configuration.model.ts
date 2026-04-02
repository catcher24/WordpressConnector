import { CollectorCollectionMethod, CollectorAuthenticationMethod } from '../enums';

export class ScannerConfigurationModel {
  id!: string;
  scannerId!: string;
  collectorGroupId!: string;
  collectionMethod!: CollectorCollectionMethod;
  authenticationMethod!: CollectorAuthenticationMethod;
  scheduleInterval?: string;
  nextRun?: Date;
  debugCollectorIds!: string[];
  preventKillOfCollectorIds!: string[];
  debugTill?: Date;
  configuration!: Record<string, string>;
  confidentialConfiguration!: Record<string, string>;

  static asScannerConfigurationModel = (unknownType: unknown) => unknownType as ScannerConfigurationModel;
}
