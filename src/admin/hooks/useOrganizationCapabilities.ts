import { useMemo } from 'react';
import {
  AllowedCollectionMethods, AllowedScheduleIntervals, CollectorCollectionMethod,
  getIndividualCollectionMethods,
  TargetType
} from "../enums";
import {OrganizationModel} from "../models";

export interface OrganizationCapabilities {
  canAddTargetType: (targetType: TargetType) => boolean;
  isCollectorGroupAllowed: (collectorGroupId: string, targetType: TargetType) => boolean;
  getTargetCapabilities: (targetType: TargetType) => {
    allowedCollectionMethods: CollectorCollectionMethod[];
    allowedScheduleIntervals: AllowedScheduleIntervals;
  };
}

// 2. Assign the return type to the hook
export function useOrganizationCapabilities(organization: OrganizationModel | null): OrganizationCapabilities {
  return useMemo(() => {

    // Early return (Failsafe)
    if (!organization || !organization.isActive) {
      return {
        canAddTargetType: () => false,
        isCollectorGroupAllowed: () => false,
        getTargetCapabilities: () => ({ allowedCollectionMethods: [], allowedScheduleIntervals: [] }),
      };
    }

    const targetCapabilities = organization.capabilities?.targetCapabilities || {};
    const targetTypeUsage = organization.usageMetrics?.targetTypeCounts || {};

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

    const getTargetCapabilities = (targetType: TargetType) => {
      const cap = targetCapabilities.get(targetType);

      const rawCollection = cap?.allowedCollectionMethods || AllowedCollectionMethods.OnRequest;

      return {
        allowedCollectionMethods: getIndividualCollectionMethods(rawCollection),
        allowedScheduleIntervals: cap?.allowedScheduleIntervals
      };
    };

    return {
      canAddTargetType,
      isCollectorGroupAllowed,
      getTargetCapabilities,
    };
  }, [organization]);
}
