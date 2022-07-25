import { Request } from "express";
import Stripe from "stripe";
import { getErrorMessage } from "../../client/src/App/utils/error";

// It should use a different Strip_Secret depending on whether it's testing.
export function getStripe(): Stripe {
  const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: "2020-08-27",
  });
  return stripe;
}

export function getStripeEvent(req: Request): Stripe.Event {
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];
  try {
    return stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (ex) {
    throw new Error(`Stripe Webhook Error: ${getErrorMessage(ex)}`);
  }
}
