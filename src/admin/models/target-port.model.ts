import { PortType } from '../enums';
import {SeverityModel} from "./severity.model";
import {VulnerabilitySummaryModel} from "./vulnerability-summary.model";

export class TargetPortModel {
  type!: PortType;
  value!: number;
  severity!: SeverityModel;
  mostSevereVulnerability!: VulnerabilitySummaryModel;
  vulnerabilityIds: string[] = [];
  silencedVulnerabilityIds: string[] = [];
  assetVersionIds: string[] = [];

  static asTargetPortModel = (unknownType: unknown) => unknownType as TargetPortModel;
}
