import { Request, Response } from "express";
import Stripe from "stripe";
import { SectionValues } from "../../client/src/App/sharedWithServer/SectionsMeta/relSectionsUtils/valueMetaTypes";
import { PackBuilderSection } from "../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { queryParameters } from "../DbSectionsModel";
import { getStripeEvent } from "../routeUtils/stripe";
import { DbUser } from "./shared/DbSections/DbUser";
import { QueryUser } from "./shared/DbSections/QueryUser";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";

export const stripeWebhookWare = [stripeWebhook];

async function stripeWebhook(req: Request, res: Response) {
  const event = getStripeEvent(req);
  res.status(200).end();
  switch (event.type) {
    case "customer.created": {
      const customer = event.data.object as any;
      const dbUser = await DbUser.queryByEmail(customer.email);
      await findUserByIdAndUpdate({
        userId: dbUser.userId,
        doWhat: "set stripe customer id",
        queryParameters: queryParameters.updateVarb({
          storeName: "stripeInfo",
          sectionName: "stripeInfo" as "stripeInfo",
          varbName: "customerId",
          value: customer.id,
        }),
      });
    }
    // subsicription object api: https://stripe.com/docs/api/subscriptions/object
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const subId = subscription.id;
      const subValues: SectionValues<"stripeSubscription"> = {
        subId: subId,
        subStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        priceIds: subscription.items.data.map((item) => item.price.id),
      };

      const updatedSub = PackBuilderSection.initAsOmniChild(
        "stripeSubscription",
        {
          dbVarbs: subValues,
        }
      );
      const updatedPack = updatedSub.makeSectionPack();

      const customerId = subscription.customer as string;
      const querier = await QueryUser.init(customerId, "customerId");
      const subPacks = await querier.getSectionPackArr("stripeSubscription");

      const currentIdx = subPacks.findIndex(
        (sub) => sub.rawSections.stripeSubscription[0].dbVarbs.subId === subId
      );

      if (currentIdx === -1) subPacks.push(updatedPack);
      else subPacks[currentIdx] = updatedPack;

      await querier.setSectionPackArr({
        storeName: "stripeSubscription",
        sectionPackArr: subPacks,
      });
    }
  }
}
