export interface CollectorSpecializationModel {
  id: string;
  name: string;
  displayName: string;
  requiredProtocols: string[];
  requiredCpes: string[];
  averageDuration: string;
  timeoutDuration: string;
  defaultConfigurationSettings: Record<string, string>;
}
