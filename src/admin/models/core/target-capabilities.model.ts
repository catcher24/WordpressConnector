import {
  AllowedAuthenticationMethods,
  AllowedCollectionInputMethods,
  AllowedCollectionMethods,
  AllowedScheduleIntervals,
  AllowedApiSchemas
} from '../../enums';

export class TargetCapabilitiesModel {
  allowedCollectionInputMethods!: AllowedCollectionInputMethods;
  allowedCollectionMethods!: AllowedCollectionMethods;
  allowedAuthenticationMethods!: AllowedAuthenticationMethods;
  allowedApiSchemas!: AllowedApiSchemas;
  allowedScheduleIntervals!: AllowedScheduleIntervals;
  allowedCollectorGroupIds!: string[];
  excludedCollectorIds!: string[];
  maxTargets?: number;

  static asTargetCapabilitiesModel = (unknownType: unknown): TargetCapabilitiesModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<TargetCapabilitiesModel>;
    const targetCapabilities = new TargetCapabilitiesModel();

    targetCapabilities.allowedCollectionInputMethods =
      obj.allowedCollectionInputMethods ?? AllowedCollectionInputMethods.Single;
    targetCapabilities.allowedCollectionMethods = obj.allowedCollectionMethods ?? AllowedCollectionMethods.OnRequest;
    targetCapabilities.allowedAuthenticationMethods = obj.allowedAuthenticationMethods ?? AllowedAuthenticationMethods.None;
    targetCapabilities.allowedApiSchemas = obj.allowedApiSchemas ?? AllowedApiSchemas.None;
    targetCapabilities.allowedScheduleIntervals = obj.allowedScheduleIntervals ?? AllowedScheduleIntervals.None;
    targetCapabilities.allowedCollectorGroupIds = obj.allowedCollectorGroupIds ?? [];
    targetCapabilities.excludedCollectorIds = obj.excludedCollectorIds ?? [];
    targetCapabilities.maxTargets = obj.maxTargets ?? undefined;

    return targetCapabilities;
  };
}
