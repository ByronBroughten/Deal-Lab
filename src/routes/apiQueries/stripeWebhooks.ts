import { Request, Response } from "express";
import { queryParameters } from "../DbSectionsModel";
import { getStripeEvent } from "../routeUtils/stripe";
import { DbUser } from "./shared/DbSections/DbUser";
import { findUserByIdAndUpdate } from "./shared/findAndUpdate";

// subsicription object api: https://stripe.com/docs/api/subscriptions/object

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
        doWhat: "upgrade user to pro",
        queryParameters: queryParameters.updateVarb({
          storeName: "serverOnlyUser",
          sectionName: "serverOnlyUser",
          varbName: "customerId",
          value: customer.id,
        }),
      });
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // query DbUser by customerId
      // adjust auth
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      // query DbUser by customerId
      // adjust auth
    }
  }
}
