export class SeverityModel {
  total!: number;
  critical!: number;
  high!: number;
  medium!: number;
  low!: number;
  noise!: number;

  static asSeverityModel = (unknownType: unknown) => unknownType as SeverityModel;
}
