import { CapabilitiesModel, SubscriptionModel, UsageMetricsModel } from './core';

/**
 * Represents an organization within the application, including its identity, billing,
 * subscription, usage metrics, capabilities, integrations, and membership details.
 */
export class OrganizationModel {
  /** Unique identifier for the organization. */
  id!: string;
  /** Tenant identifier associated with the organization. */
  tenantId!: string;
  /** User ID of the organization's administrator. */
  adminUserId!: string;
  /** Organization's unique string identifier. */
  identifier!: string;
  /** Display name of the organization. */
  name!: string;
  /** Indicates if the organization is currently active. */
  isActive!: boolean;
  /** The organization's current subscription, if any. */
  subscription?: SubscriptionModel;
  /** Usage metrics for the organization. */
  usageMetrics!: UsageMetricsModel;
  /** Capabilities enabled for the organization. */
  capabilities!: CapabilitiesModel;
  /** Date the organization was created. */
  createdAt!: Date;
  /** Date the organization was last updated, if available. */
  updatedAt?: Date;
  /** Date the organization's terms were accepted, if available. */
  termsAcceptedAt?: Date;
  /** Organization timezone, in Europe/Amsterdam format. */
  timezone!: string;
  /** Indicates if the organization is ready for use. */
  isReady!: boolean;
  /** Indicates if the organization is in a trial state. */
  isTrial!: boolean;
  /** List of member user IDs in the organization. */
  memberIds!: string[];
  /** List of invitation IDs for the organization. */
  invitations!: string[];

  /**
   * Safely casts an unknown value to an `OrganizationModel` instance,
   * providing defaults for missing fields and validating input structure.
   * @param unknownType - The value to cast.
   * @returns An `OrganizationModel` instance or `null` if input is null.
   * @throws Error if input is not an object.
   */
  static asOrganizationModel = (unknownType: unknown): OrganizationModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<OrganizationModel>;

    // Ensure required fields are present, and instantiate defaults if not provided
    const organization = new OrganizationModel();
    organization.id = obj.id ?? '';
    organization.tenantId = obj.tenantId ?? '';
    organization.adminUserId = obj.adminUserId ?? '';
    organization.identifier = obj.identifier ?? '';
    organization.name = obj.name ?? '';
    organization.isActive = obj.isActive ?? false;
    organization.subscription = SubscriptionModel.asSubscriptionModel(obj.subscription) ?? undefined;
    organization.usageMetrics = UsageMetricsModel.asUsageMetricsModel(obj.usageMetrics) ?? new UsageMetricsModel();
    organization.capabilities = CapabilitiesModel.asCapabilitiesModel(obj.capabilities) ?? new CapabilitiesModel();
    organization.createdAt = obj.createdAt ?? new Date();
    organization.updatedAt = obj.updatedAt ?? undefined;
    organization.termsAcceptedAt = obj.termsAcceptedAt ?? undefined;
    organization.timezone = obj.timezone ?? '';
    organization.isReady = obj.isReady ?? false;
    organization.isTrial = obj.isTrial ?? false;
    organization.memberIds = obj.memberIds ?? [];
    organization.invitations = obj.invitations ?? [];

    return organization;
  };
}
