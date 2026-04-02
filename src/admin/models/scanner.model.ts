export class ScannerModel {
  id!: string;
  collectorGroupId!: string;

  static asScannerModel = (unknownType: unknown) => unknownType as ScannerModel;
}
