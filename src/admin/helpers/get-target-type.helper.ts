import { TargetType } from '../enums';

export const getTargetTypeDisplayName = (targetType: TargetType, options?: { plural?: boolean }): string => {
  const methodDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Device',
    [TargetType.WebApplication]: 'Web Application',
  };

  const pluralDisplayNames: { [key in TargetType]: string } = {
    [TargetType.Host]: 'Infrastructure Devices',
    [TargetType.WebApplication]: 'Web Applications',
  };

  const isPlural = options?.plural;

  return isPlural ? pluralDisplayNames[targetType] : methodDisplayNames[targetType];
};
