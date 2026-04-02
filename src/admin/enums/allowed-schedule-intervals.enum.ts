import { ScheduleInterval } from './schedule-interval.enum';

/**
 * Enum representing allowed schedule intervals for scheduling tasks or jobs.
 */
export enum AllowedScheduleIntervals {
  // Individual intervals
  Minutes = 'minutes',
  Hourly = 'hourly',
  Daily = 'daily',
  SemiWeekly = 'semiWeekly',
  Weekly = 'weekly',
  SemiMonthly = 'semiMonthly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  SemiYearly = 'semiYearly',
  Yearly = 'yearly',

  // Common named combinations
  None = 'none',
  HourlyAndHigher = 'hourlyAndHigher',
  DailyAndHigher = 'dailyAndHigher',
  WeeklyAndHigher = 'weeklyAndHigher',
  MonthlyAndHigher = 'monthlyAndHigher',
  QuarterlyAndHigher = 'quarterlyAndHigher',
  YearlyOnly = 'yearlyOnly',
  All = 'all',
}

/**
 * Maps an allowedScheduleInterval combination string to an array of individual ScheduleInterval strings.
 * @param allowedInterval The allowed schedule interval combination string.
 * @returns An array of individual ScheduleInterval strings.
 */
export function getIndividualScheduleIntervals(allowedInterval: AllowedScheduleIntervals): ScheduleInterval[] {
  if (!allowedInterval) return [];

  switch (allowedInterval) {
    case AllowedScheduleIntervals.All:
      return [
        ScheduleInterval.Minutes,
        ScheduleInterval.Hourly,
        ScheduleInterval.Daily,
        ScheduleInterval.SemiWeekly,
        ScheduleInterval.Weekly,
        ScheduleInterval.SemiMonthly,
        ScheduleInterval.Monthly,
        ScheduleInterval.Quarterly,
        ScheduleInterval.SemiYearly,
        ScheduleInterval.Yearly,
      ];
    case AllowedScheduleIntervals.HourlyAndHigher:
      return [
        ScheduleInterval.Hourly,
        ScheduleInterval.Daily,
        ScheduleInterval.SemiWeekly,
        ScheduleInterval.Weekly,
        ScheduleInterval.SemiMonthly,
        ScheduleInterval.Monthly,
        ScheduleInterval.Quarterly,
        ScheduleInterval.SemiYearly,
        ScheduleInterval.Yearly,
      ];
    case AllowedScheduleIntervals.DailyAndHigher:
      return [
        ScheduleInterval.Daily,
        ScheduleInterval.SemiWeekly,
        ScheduleInterval.Weekly,
        ScheduleInterval.SemiMonthly,
        ScheduleInterval.Monthly,
        ScheduleInterval.Quarterly,
        ScheduleInterval.SemiYearly,
        ScheduleInterval.Yearly,
      ];
    case AllowedScheduleIntervals.WeeklyAndHigher:
      return [
        ScheduleInterval.Weekly,
        ScheduleInterval.SemiMonthly,
        ScheduleInterval.Monthly,
        ScheduleInterval.Quarterly,
        ScheduleInterval.SemiYearly,
        ScheduleInterval.Yearly,
      ];
    case AllowedScheduleIntervals.MonthlyAndHigher:
      return [
        ScheduleInterval.Monthly,
        ScheduleInterval.Quarterly,
        ScheduleInterval.SemiYearly,
        ScheduleInterval.Yearly,
      ];
    case AllowedScheduleIntervals.QuarterlyAndHigher:
      return [ScheduleInterval.Quarterly, ScheduleInterval.SemiYearly, ScheduleInterval.Yearly];
    case AllowedScheduleIntervals.YearlyOnly:
      return [ScheduleInterval.Yearly];
    case AllowedScheduleIntervals.None:
      return [];
    default:
      // Fallback for unhandled cases
      return [];
  }
}
