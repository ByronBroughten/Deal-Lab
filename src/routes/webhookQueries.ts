import { Express } from "express";
import { constants } from "../client/src/App/Constants";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import {
  stripeWebhookTestWare,
  stripeWebhookWare,
} from "./apiQueries/stripeWebhooks";

export function useStripeWebhooks(app: Express) {
  const webhookWare = {
    stripe: stripeWebhookWare,
    stripeTest: stripeWebhookTestWare,
  } as const;
  Obj.entries(webhookWare).forEach(([webhookName, ware]) => {
    app.post(`${constants.apiPathBit}/webhook/${webhookName}`, ...ware);
  });
}
