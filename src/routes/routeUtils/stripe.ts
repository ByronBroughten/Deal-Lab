import { Request } from "express";
import Stripe from "stripe";
import { getErrorMessage } from "../../client/src/App/utils/error";

export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET;
  const stripe = new Stripe(secret as string, {
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
