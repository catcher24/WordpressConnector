/**
 * Enum representing the available scheduling intervals for tasks or events.
 *
 * - `None`: No interval.
 * - `Minutes`: Every few minutes.
 * - `Hourly`: Every hour.
 * - `Daily`: Every day.
 * - `SemiWeekly`: Twice a week.
 * - `Weekly`: Every week.
 * - `SemiMonthly`: Twice a month.
 * - `Monthly`: Every month.
 * - `Quarterly`: Every three months.
 * - `SemiYearly`: Twice a year.
 * - `Yearly`: Every year.
 */
export enum ScheduleInterval {
  None = 'none',
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
}
