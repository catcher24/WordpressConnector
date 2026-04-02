import { CollectorCollectionMethod, CollectorStatus, CollectorType, TargetType } from '../enums';
import { ScanRunnerModel } from './scan-runner.model';

export class ScanModel {
  id!: string;
  tenantId!: string;
  organizationId!: string;
  scannerId!: string;
  collectionMethod!: CollectorCollectionMethod;
  targetId!: string;
  targetType!: TargetType;
  startedAt!: Date;
  endedAt?: Date;
  runners: ScanRunnerModel[] = [];

  static asScanModel = (unknownType: unknown) => unknownType as ScanModel;

  static eventAsScanModel = (unknownType: any) => {
    return {
      id: unknownType.Id,
      scannerId: unknownType.ScannerId,
      collectionMethod:
        CollectorCollectionMethod[unknownType.CollectionMethod as keyof typeof CollectorCollectionMethod],
      targetId: unknownType.TargetId,
      targetType: unknownType.TargetType,
      startedAt: unknownType.StartedAt,
      endedAt: unknownType.EndedAt,
      runners: unknownType.Runners.map((x: any) => {
        return {
          collectorId: x.CollectorId,
          collectorSpecializationId: x.CollectorSpecializationId,
          progression: x.Progression ? Number(x.Progression) : null,
          startedAt: x.StartedAt ? new Date(x.StartedAt) : null,
          endedAt: x.EndedAt ? new Date(x.EndedAt) : null,
          collectorType: CollectorType[x.CollectorType as keyof typeof CollectorType],
          collectorStatus: CollectorStatus[x.CollectorStatus as keyof typeof CollectorStatus],
          configuration: x.Configuration,
        } as ScanRunnerModel;
      }),
    } as ScanModel;
  };
}
