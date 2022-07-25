import { StripeSubStatus } from "../../../utils/stripe";

type StripeSubscription = {
  subId: string;
  priceId: string;
  status: StripeSubStatus;
};

export type StripeSubscriptions = StripeSubscription[];
