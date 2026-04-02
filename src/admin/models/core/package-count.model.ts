export class PackageCountModel {
  unitCount!: number;
  commitCount?: number;

  static asPackageCountModel = (unknownType: unknown): PackageCountModel | null => {
    if (unknownType == null) {
      return null;
    }

    if (typeof unknownType !== 'object') {
      throw new Error('Invalid input: Expected an object.');
    }

    const obj = unknownType as Partial<PackageCountModel>;

    const packageCount = new PackageCountModel();
    packageCount.unitCount = obj.unitCount ?? 0; // Default to 0 if undefined
    packageCount.commitCount = obj.commitCount ?? undefined;

    return packageCount;
  };
}
