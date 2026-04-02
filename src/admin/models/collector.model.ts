import {
  AllowedApiSchemas,
  AllowedAuthenticationMethods,
  AllowedCollectionInputMethods,
  AllowedCollectionMethods,
  AllowedCollectorTypes,
} from '../enums';
import { CollectorSpecializationModel } from './collector-specialization.model';

export class CollectorModel {
  id!: string;
  allowedCollectionInputMethods!: AllowedCollectionInputMethods;
  allowedCollectionMethods!: AllowedCollectionMethods;
  allowedAuthenticationMethods!: AllowedAuthenticationMethods;
  allowedApiSchemas!: AllowedApiSchemas;
  allowedCollectorTypes!: AllowedCollectorTypes;
  clientSecret!: string | null;
  dependsOn!: string[];
  isSpecializedOnly!: boolean;
  name!: string;
  displayName!: string;
  averageDuration!: string;
  timeoutDuration!: string;
  defaultConfigurationSettings!: Record<string, string>;
  collectorSpecializations!: CollectorSpecializationModel[];

  static asCollectorModel = (unknownType: unknown) => unknownType as CollectorModel;
}
