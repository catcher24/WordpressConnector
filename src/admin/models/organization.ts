export interface PackageCountModel {
  packageId: string;
  unitCount: number;
}

export interface SubscriptionModel {
  status: number;
  tenantOrganizationPackages?: Record<string, Record<string, PackageCountModel>>;
}

export interface UsageMetricsModel {
  targetTypeCounts?: Record<string, number>;
}

export interface OrganizationModel {
  id: string;
  tenantId: string;
  name: string;
  isActive: boolean;
  isTrial: boolean;
  subscription?: SubscriptionModel;
  usageMetrics?: UsageMetricsModel;
}
