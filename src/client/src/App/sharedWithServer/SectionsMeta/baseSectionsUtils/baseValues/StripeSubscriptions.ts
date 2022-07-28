import { StripeSubStatus } from "../../../utils/stripe";

// Now, when someone logs in:

// 2. How will the front-end state reflect provision?
// The front-end can directly access subscriptions and
// determine provisioning that way.

// It will need a function that calls the database when
// an active status subscription runs out.

// subscriptions could be a section with a stringArray of priceIds
// there can be an equivalent on the front-end.

// dbStore would have stripeSubscriptions, as would feStore

// the db keeps them up to date—the fe is not allowed to change them.

// If someone's subscription ends, I want them to be able to
// renew it.
// The front-end should know about it.

// When a subscription ends, the front-end should
// call the db to update its subscriptions

type StripeSubscription = {
  subId: string;
  priceIds: string[];
  currentPeriodEnd: number;
  status: StripeSubStatus;
  // when will I update the status?
  // I can update it in the db when I get a webhook event from stripe

  // I could use a webSocket to then update it on the fe

  // Or I can check my db every time a user uses a pro-protected feature
  // Or I can store the end of the subscription period in the
  // JWT

  // Ok, so the JWT has the end of the subscription period
  // Maybe serverOnly user should have it, too.

  // can JWT have

  // Then just check whether that is in the future. If it is, hit up stripe again
  // to re-verify it.

  // if the currentPeriodEnd is in the past and the status is active
  // ask the db for a subscription update.

  // A tricky part is, I can't exactly take back the table data.
  // For now, that's ok.
};

export type StripeSubscriptions = StripeSubscription[];
