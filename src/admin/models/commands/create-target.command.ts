import {CollectorAuthenticationMethod, CollectorCollectionMethod, TargetType} from "../../enums";

export class CreateTargetCommand {
  type = TargetType.Host;
  targetAddress = '';
  displayName? = '';
  scannerConfigurations: ScannerConfigurations[] = [];

  static createTargetCommandValue(value: any): CreateTargetCommand {
    const configuration = {
      ...value.configuration
    };

    if (configuration.extraFormFields && Array.isArray(configuration.extraFormFields)) {
      configuration.extraFormFields = configuration.extraFormFields.filter((field: any) => field.name !== '');
      configuration.extraFormFields = JSON.stringify(configuration.extraFormFields);
    }
    if (configuration.headers && Array.isArray(configuration.headers)) {
      configuration.headers = configuration.headers.filter((field: any) => field.name !== '');
      configuration.headers = JSON.stringify(configuration.headers);
    }
    if (configuration.cookies && Array.isArray(configuration.cookies)) {
      configuration.cookies = configuration.cookies.filter((field: any) => field.name !== '');
      configuration.cookies = JSON.stringify(configuration.cookies);
    }

    const confidentialConfiguration = {
      ...value.confidentialConfiguration
    };

    return {
      targetAddress: value.targetAddress,
      type: value.type,
      displayName: value.displayName,
      scannerConfigurations: [
        {
          collectorGroupId: value.collectorGroupId,
          collectionMethod: value.collectionMethod,
          authenticationMethod: value.authenticationMethod,
          scheduleInterval: value.scheduleInterval,
          configuration: configuration,
          confidentialConfiguration: confidentialConfiguration,
          startOnCreate: value.startOnCreate,
          debugCollectorIds: value.debugCollectorIds,
          preventKillOfCollectorIds: value.preventKillOfCollectorIds,
          debugTill: value.debugTill,
        },
      ],
    };
  }
}

export interface ScannerConfigurations {
  collectorGroupId: '';
  collectionMethod: CollectorCollectionMethod;
  authenticationMethod: CollectorAuthenticationMethod;
  configuration: Record<string, string>;
  confidentialConfiguration: Record<string, string>;
  scheduleInterval?: string | null;
  debugCollectorIds: string[];
  preventKillOfCollectorIds: string[];
  debugTill?: Date | null;
  startOnCreate: false;
}

