import { Stripe } from "stripe";
import { Arr } from "./Arr";

export type StripeSubStatus = Stripe.Subscription.Status;
const stripeSubStatuses: StripeSubStatus[] = [
  "trialing",
  "active",
  "past_due",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "canceled",
];

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
