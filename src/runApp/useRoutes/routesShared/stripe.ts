import { Request } from "express";
import Stripe from "stripe";
import { getErrorMessage } from "../../../client/src/sharedWithServer/utils/Error";

export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET;
  const stripe = new Stripe(secret as string, {
    apiVersion: "2020-08-27",
  });
  return stripe;
}
// create a version of this that uses process.env.STRIPE_WEBHOOK_SECRET_TEST
//

export function getStripeEvent(req: Request, secret: string): Stripe.Event {
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") {
    throw new Error(`Signature is not a string but rather, "${signature}"`);
  }
  try {
    return stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      secret
    );
  } catch (ex) {
    throw new Error(`Stripe Webhook Error: ${getErrorMessage(ex)}`);
  }
}

type MakePaymentProps = { paymentMethodId: string; costInCents: number };
async function makePayment({ paymentMethodId, costInCents }: MakePaymentProps) {
  const stripe = getStripe();
  const payment = await stripe.paymentIntents.create({
    payment_method: paymentMethodId,
    amount: costInCents,
    currency: "USD",
    description: "Pro Subscription",
    confirm: true,
  });
}
