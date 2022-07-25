import { Request, Response } from "express";
import { ApiStorageAuth } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSections";
import { stripeS } from "../../client/src/App/sharedWithServer/utils/stripe";
import { queryParameters } from "../DbSectionsModel";
import { getStripeEvent } from "../routeUtils/stripe";
import { DbUser } from "./shared/DbSections/DbUser";
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
        doWhat: "add customer id",
        queryParameters: queryParameters.updateVarb({
          storeName: "serverOnlyUser",
          sectionName: "serverOnlyUser",
          varbName: "customerId",
          value: customer.id,
        }),
      });
    }
    // subsicription object api: https://stripe.com/docs/api/subscriptions/object

    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      if (stripeS.isActiveSubStatus(subscription.status)) {
        const dbUser = await DbUser.queryByCustomerId(subscription.customer);
        if (dbUser.apiStorageAuth !== "fullStorage") {
          await findUserByIdAndUpdate({
            userId: dbUser.userId,
            doWhat: "upgrade user to pro",
            queryParameters: queryParameters.updateVarb({
              storeName: "user",
              sectionName: "user",
              varbName: "apiStorageAuth",
              value: "fullStorage" as ApiStorageAuth,
            }),
          });
        }
      }
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      if (stripeS.isInactiveSubStatus(subscription.status)) {
        const dbUser = await DbUser.queryByCustomerId(subscription.customer);
        if (dbUser.apiStorageAuth !== "basicStorage") {
          await findUserByIdAndUpdate({
            userId: dbUser.userId,
            doWhat: "downgrade user from pro",
            queryParameters: queryParameters.updateVarb({
              storeName: "user",
              sectionName: "user",
              varbName: "apiStorageAuth",
              value: "basicStorage",
            }),
          });
        }
      }
    }
  }
}
