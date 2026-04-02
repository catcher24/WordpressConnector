import { CollectorStatus, CollectorType } from '../enums';

export class ScanRunnerModel {
  collectorId!: string;
  collectorSpecializationId?: string;
  progression?: number;
  startedAt!: Date;
  endedAt?: Date;
  collectorType!: CollectorType;
  collectorStatus!: CollectorStatus;
  configuration: Record<string, string> = {};

  static asTargetScanRunnerModel = (unknownType: unknown) => unknownType as ScanRunnerModel;

  static eventAsScanModel = (unknownType: any) => {
    return {
      collectorId: unknownType.CollectorId,
      progression: unknownType.Progression ? Number(unknownType.Progression) : null,
      startedAt: unknownType.StartedAt ? new Date(unknownType.StartedAt) : null,
      endedAt: unknownType.EndedAt ? new Date(unknownType.EndedAt) : null,
      collectorType: CollectorType[unknownType.CollectorType as keyof typeof CollectorType],
      collectorStatus: CollectorStatus[unknownType.CollectorStatus as keyof typeof CollectorStatus],
      configuration: unknownType.Configuration,
    } as ScanRunnerModel;
  };
}
