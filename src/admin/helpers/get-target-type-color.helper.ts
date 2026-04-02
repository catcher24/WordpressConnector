import {TargetType} from "../enums";

export const getTargetTypeColor = (targetType: TargetType): string => {
  const colors: { [key in TargetType]: string } = {
    [TargetType.Host]: '#0a454f',
    [TargetType.WebApplication]: '#c3b251',
  };
  return colors[targetType] || '#6c757d';
};
