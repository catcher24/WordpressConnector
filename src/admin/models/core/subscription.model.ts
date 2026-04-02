import { PackageCountModel } from './package-count.model';
import {PricingIntervalEnum, PricingSchemeEnum, SubscriptionStatus, TargetType} from '../../enums';

export class SubscriptionModel {
  pricingScheme?: PricingSchemeEnum;
  pricingInterval?: PricingIntervalEnum;
  status!: SubscriptionStatus;
  hasConfiguredPaymentMethod!: boolean;
  cancelledAt?: Date;
  cancelAt?: Date;
  trialEndsAt?: Date;
  validUpto!: Date;
  couponIds!: string[];
  tenantPackages?: Map<TargetType, Map<string, PackageCountModel>>;
  tenantOrganizationPackages?: Map<TargetType, Map<string, PackageCountModel>>;
  isTrial!: boolean;

  static asSubscriptionModel = (unknownType: unknown): SubscriptionModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<SubscriptionModel>;

    const subscription = new SubscriptionModel();
    subscription.pricingScheme = obj.pricingScheme ?? undefined;
    subscription.pricingInterval = obj.pricingInterval ?? undefined;
    subscription.status = obj.status ?? SubscriptionStatus.Active; // adjust default as needed
    subscription.hasConfiguredPaymentMethod = obj.hasConfiguredPaymentMethod ?? false;
    subscription.cancelledAt = obj.cancelledAt ? new Date(obj.cancelledAt) : undefined;
    subscription.cancelAt = obj.cancelAt ? new Date(obj.cancelAt) : undefined;
    subscription.trialEndsAt = obj.trialEndsAt ? new Date(obj.trialEndsAt) : undefined;
    subscription.validUpto = obj.validUpto ? new Date(obj.validUpto) : new Date();
    subscription.couponIds = obj.couponIds ?? [];
    subscription.isTrial = obj.isTrial ?? false;

    // Instantiate tenantPackages map
    const parsePackageMap = (input: any): Map<TargetType, Map<string, PackageCountModel>> => {
      const result = new Map<TargetType, Map<string, PackageCountModel>>();

      if (input instanceof Map) {
        input.forEach((value, key) => {
          if (value instanceof Map) {
            result.set(key, value);
          } else if (value && typeof value === 'object') {
            const innerMap = new Map<string, PackageCountModel>();
            Object.entries(value).forEach(([pkgId, pkgValue]) => {
              innerMap.set(pkgId, PackageCountModel.asPackageCountModel(pkgValue)!);
            });
            result.set(key, innerMap);
          }
        });
      } else if (input && typeof input === 'object') {
        Object.entries(input).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            const innerMap = new Map<string, PackageCountModel>();
            Object.entries(value).forEach(([pkgId, pkgValue]) => {
              innerMap.set(pkgId, PackageCountModel.asPackageCountModel(pkgValue)!);
            });
            result.set(key as TargetType, innerMap);
          }
        });
      }

      return result;
    };

    subscription.tenantPackages = parsePackageMap(obj.tenantPackages);
    subscription.tenantOrganizationPackages = parsePackageMap(obj.tenantOrganizationPackages);

    return subscription;
  };

  static hasActiveOrTrialingSubscription(subscription?: SubscriptionModel): boolean {
    if (!subscription) return false;
    return (
      (subscription.status === SubscriptionStatus.Active || subscription.status === SubscriptionStatus.Trialing) &&
      !SubscriptionModel.hasCancellationDate(subscription)
    );
  }

  static isCanceled(subscription?: SubscriptionModel): boolean {
    return subscription?.status === SubscriptionStatus.Canceled;
  }

  static isNextDueVisible(subscription?: SubscriptionModel): boolean {
    if (!subscription) return false;
    return !SubscriptionModel.isCanceled(subscription) && !SubscriptionModel.hasCancellationDate(subscription);
  }

  static isValidUpToVisible(subscription?: SubscriptionModel): boolean {
    if (!subscription) return false;
    return SubscriptionModel.isCanceled(subscription) || SubscriptionModel.hasCancellationDate(subscription);
  }

  static hasCancellationDate(subscription?: SubscriptionModel): boolean {
    return !!subscription?.cancelledAt;
  }
}
