import express, { Request, Response } from "express";
import Stripe from "stripe";
import { SectionValues } from "../../client/src/App/sharedWithServer/SectionsMeta/values/StateValue";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { getStripeEvent } from "../routeUtils/stripe";
import { DbUser } from "./apiQueriesShared/DbSections/DbUser";

export const stripeWebhookWare = [express.raw({ type: "*/*" }), stripeWebhook];
export const stripeWebhookTestWare = [
  express.raw({ type: "*/*" }),
  stripeWebhookTest,
];

async function stripeWebhook(req: Request, res: Response) {
  const event = getStripeEvent(
    req,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  await handleStripeEvent(event, res);
}
async function stripeWebhookTest(req: Request, res: Response) {
  const event = getStripeEvent(
    req,
    process.env.STRIPE_WEBHOOK_SECRET_TEST as string
  );
  await handleStripeEvent(event, res);
}

export function stripeSubToValues(
  sub: Stripe.Subscription
): SectionValues<"stripeSubscription"> {
  return {
    _typeUniformity: "",
    subId: sub.id,
    status: sub.status,
    currentPeriodEnd: sub.current_period_end,
    priceIds: sub.items.data.map((item) => item.price.id),
  };
}

async function handleStripeEvent(event: Stripe.Event, res: Response) {
  switch (event.type) {
    case "customer.created": {
      const customer = event.data.object as Stripe.Customer;
      // const dbUser = await LoadedDbUser.queryByEmail(customer.email as string);
      const dbUser = await DbUser.initBy("email", customer.email as string);
      await dbUser.setOnlyValue({
        storeName: "stripeInfoPrivate",
        sectionName: "stripeInfoPrivate",
        varbName: "customerId",
        value: customer.id,
      });
      break;
    }
    // subsicription object api: https://stripe.com/docs/api/subscriptions/object
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const subValues = stripeSubToValues(subscription);
      const updatedSub = PackBuilderSection.initAsOmniChild(
        "stripeSubscription",
        { dbVarbs: subValues }
      );
      const updatedPack = updatedSub.makeSectionPack();
      const customerId = subscription.customer;
      if (!(typeof customerId === "string")) {
        throw new Error(`customerId "${customerId}" needs to be a string.`);
      }
      const querier = await DbUser.initBy("customerId", customerId);
      const subPacks = await querier.getSectionPackArr("stripeSubscription");
      const currentIdx = subPacks.findIndex(
        (sub) =>
          sub.rawSections.stripeSubscription[0].dbVarbs.subId ===
          subValues.subId
      );

      const nextSubPacks = [...subPacks];
      if (currentIdx === -1) nextSubPacks.push(updatedPack);
      else nextSubPacks[currentIdx] = updatedPack;

      await querier.setSectionPackArr({
        storeName: "stripeSubscription",
        sectionPackArr: nextSubPacks,
      });
      break;
    }
  }
  res.status(200).send();
}
