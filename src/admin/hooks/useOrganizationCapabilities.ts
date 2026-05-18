import { useMemo } from 'react';
import {
  AllowedCollectionMethods,
  AllowedScheduleIntervals,
  CollectorCollectionMethod,
  getIndividualCollectionMethods,
  TargetType
} from "../enums";
import { OrganizationModel } from "../models";

export interface OrganizationCapabilities {
  canAddTargetType: (targetType: TargetType) => boolean;
  isCollectorGroupAllowed: (collectorGroupId: string, targetType: TargetType) => boolean;
  isCollectorExcluded: (collectorId: string, targetType: TargetType) => boolean;
  getTargetCapabilities: (targetType: TargetType) => {
    allowedCollectionMethods: CollectorCollectionMethod[];
    allowedScheduleIntervals: AllowedScheduleIntervals;
  };
}

export function useOrganizationCapabilities(organization: OrganizationModel | null): OrganizationCapabilities {
  return useMemo(() => {
    if (!organization) {
      return {
        canAddTargetType: (_targetType: TargetType) => false,
        isCollectorGroupAllowed: (
          _collectorGroupId: string,
          _targetType: TargetType,
        ) => false,
        isCollectorExcluded: (
          _collectorGroupId: string,
          _targetType: TargetType,
        ) => false,
        getTargetCapabilities: (_targetType: TargetType) => ({
          allowedCollectionMethods: [] as CollectorCollectionMethod[],
          allowedScheduleIntervals: [] as unknown as AllowedScheduleIntervals,
        }),
      };
    }

    const targetCapabilities = organization.capabilities?.targetCapabilities || new Map();
    const targetTypeUsage = organization.usageMetrics?.targetTypeCounts || new Map();

    const canAddTargetType = (targetType: TargetType): boolean => {
      const cap = targetCapabilities.get(targetType);
      if (!cap) return false;
      if (cap.maxTargets === undefined || cap.maxTargets === null) return true;
      const usage = targetTypeUsage.get(targetType) || 0;
      return cap.maxTargets > usage;
    };

    const isCollectorGroupAllowed = (collectorGroupId: string, targetType: TargetType): boolean => {
      const allowedGroupIds = targetCapabilities.get(targetType)?.allowedCollectorGroupIds;
      if (!allowedGroupIds?.includes(collectorGroupId)) return false;
      return canAddTargetType(targetType);
    };

    const isCollectorExcluded = (
      collectorId: string,
      targetType: TargetType,
    ): boolean => {
      const excludedIds =
        targetCapabilities.get(targetType)?.excludedCollectorIds;

      const normalizedCollectorId = collectorId.toLowerCase();

      const isExcluded =
        excludedIds?.some((id) => id.toLowerCase() === normalizedCollectorId) ||
        false;

      return isExcluded;
    };

    const getTargetCapabilities = (targetType: TargetType) => {
      const cap = targetCapabilities.get(targetType);
      const rawCollection = cap?.allowedCollectionMethods || AllowedCollectionMethods.OnRequest;

      return {
        allowedCollectionMethods: getIndividualCollectionMethods(rawCollection),
        allowedScheduleIntervals: cap?.allowedScheduleIntervals || ([] as unknown as AllowedScheduleIntervals),
      };
    };

    return {
      canAddTargetType,
      isCollectorGroupAllowed,
      isCollectorExcluded,
      getTargetCapabilities,
    };
  }, [organization]);
}
