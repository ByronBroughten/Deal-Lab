import { Arr } from "./Arr";

export type StripeSubStatus = typeof stripeSubStatuses[number];
const stripeSubStatuses = [
  "trialing",
  "active",
  "past_due",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "canceled",
] as const;

export type StripeActiveSubStatus = typeof activeStatuses[number];
const activeStatuses = Arr.extractStrict(stripeSubStatuses, [
  "active",
  "trialing",
  "past_due",
] as const);

export type StripeInactiveSubStatus = typeof inactiveStatuses[number];
const inactiveStatuses = Arr.excludeStrict(stripeSubStatuses, activeStatuses);

export const stripeS = {
  isActiveSubStatus(value: any): value is StripeActiveSubStatus {
    return activeStatuses.includes(value);
  },
  isInactiveSubStatus(value: any): value is StripeInactiveSubStatus {
    return inactiveStatuses.includes(value);
  },
};
