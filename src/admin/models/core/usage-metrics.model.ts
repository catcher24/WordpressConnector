import { TargetType } from '../../enums';

export class UsageMetricsModel {
  targetTypeCounts!: Map<TargetType, number>;
  integrationCounts!: Map<string, number>;

  static asUsageMetricsModel = (unknownType: unknown): UsageMetricsModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<UsageMetricsModel>;
    const usageMetrics = new UsageMetricsModel();

    usageMetrics.targetTypeCounts = new Map<TargetType, number>();
    if (obj.targetTypeCounts instanceof Map) {
      obj.targetTypeCounts.forEach((value, key) => {
        usageMetrics.targetTypeCounts.set(key, value);
      });
    } else if (obj.targetTypeCounts && typeof obj.targetTypeCounts === 'object') {
      Object.entries(obj.targetTypeCounts).forEach(([key, value]) => {
        usageMetrics.targetTypeCounts.set(key as TargetType, Number(value));
      });
    }

    usageMetrics.integrationCounts = new Map<string, number>();
    if (obj.integrationCounts instanceof Map) {
      obj.integrationCounts.forEach((value, key) => {
        usageMetrics.integrationCounts.set(key, value);
      });
    } else if (obj.integrationCounts && typeof obj.integrationCounts === 'object') {
      Object.entries(obj.integrationCounts).forEach(([key, value]) => {
        usageMetrics.integrationCounts.set(key, Number(value));
      });
    }

    return usageMetrics;
  };
}
