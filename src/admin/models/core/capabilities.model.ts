import { TargetType } from '../../enums';
import { TargetCapabilitiesModel } from './target-capabilities.model';

export class CapabilitiesModel {
  targetCapabilities!: Map<TargetType, TargetCapabilitiesModel>;

  static asCapabilitiesModel = (unknownType: unknown): CapabilitiesModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<CapabilitiesModel>;
    const capabilities = new CapabilitiesModel();
    capabilities.targetCapabilities = CapabilitiesModel.parseTargetCapabilities(obj.targetCapabilities);

    return capabilities;
  };

  private static parseTargetCapabilities = (input: any): Map<TargetType, TargetCapabilitiesModel> => {
    const result = new Map<TargetType, TargetCapabilitiesModel>();

    if (!input) return result;

    // If it's already a Map (e.g., from a previous cast), clone it
    if (input instanceof Map) {
      input.forEach((value, key) => {
        const model = TargetCapabilitiesModel.asTargetCapabilitiesModel(value);
        if (model) result.set(key as TargetType, model);
      });
    }
    // If it's a plain JSON object (Standard API response)
    else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        const model = TargetCapabilitiesModel.asTargetCapabilitiesModel(value);
        if (model) {
          // Ensure the key matches your TargetType enum (usually a string or number)
          result.set(key as unknown as TargetType, model);
        }
      });
    }

    return result;
  };
}
