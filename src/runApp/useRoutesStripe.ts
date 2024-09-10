import { Express } from "express";
import { constant } from "../client/src/sharedWithServer/Constants";
import { Obj } from "../client/src/sharedWithServer/utils/Obj";
import {
  stripeWebhookTestWare,
  stripeWebhookWare,
} from "./useRoutes/stripeWebhooks";

export function useStripeRoutes(app: Express) {
  const webhookWare = {
    stripe: stripeWebhookWare,
    stripeTest: stripeWebhookTestWare,
  } as const;
  Obj.entries(webhookWare).forEach(([webhookName, ware]) => {
    app.post(`${constant("apiPathBit")}/webhook/${webhookName}`, ...ware);
  });
}
