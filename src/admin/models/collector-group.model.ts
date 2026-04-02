import { TargetType } from '../enums';

export class CollectorGroupModel {
  id!: string;
  targetType!: TargetType;
  name!: string;
  description!: string;
  collectorIds!: string[];
  defaultConfiguration!: Record<string, string>;
  static asCollectorGroupModel = (unknownType: unknown) => unknownType as CollectorGroupModel;
}
