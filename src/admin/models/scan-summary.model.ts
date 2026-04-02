import { ScanRunnerModel } from './scan-runner.model';

export class ScanSummaryModel {
  id!: string;
  scannerId!: number;
  targetId!: string;
  startedAt!: Date;
  endedAt!: Date;
  runners!: ScanRunnerModel[];

  static asScanSummaryModel = (unknownType: unknown) => unknownType as ScanSummaryModel;
}
