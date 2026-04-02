/**
 * Enum representing the possible statuses of a subscription.
 *
 * Used throughout the application to indicate the current state of a user's subscription.
 * Each status is mapped to a string value for consistency with backend APIs and UI display.
 *
 * @enum {string}
 * @property {string} Active - The subscription is currently active.
 * @property {string} Canceled - The subscription has been canceled.
 * @property {string} PastDue - The subscription payment is past due.
 * @property {string} Paused - The subscription is temporarily paused.
 * @property {string} Trialing - The subscription is in a trial period.
 * @property {string} Unpaid - The subscription is unpaid.
 * @property {string} Incomplete - The subscription is incomplete, usually due to payment issues.
 * @property {string} IncompleteExpired - The incomplete subscription has expired.
 * @property {string} Modifying - The subscription is being modified.
 */
export enum SubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  PastDue = 'pastDue',
  Paused = 'paused',
  Trialing = 'trialing',
  Unpaid = 'unpaid',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incompleteExpired',
  Modifying = 'modifying',
}
