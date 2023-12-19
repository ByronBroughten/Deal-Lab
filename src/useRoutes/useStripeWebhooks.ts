import { Express } from "express";
import { constants } from "../client/src/sharedWithServer/Constants";

import { Obj } from "../client/src/sharedWithServer/utils/Obj";
import {
  stripeWebhookTestWare,
  stripeWebhookWare,
} from "./routes/stripeWebhooks";

export function useStripeWebhooks(app: Express) {
  const webhookWare = {
    stripe: stripeWebhookWare,
    stripeTest: stripeWebhookTestWare,
  } as const;
  Obj.entries(webhookWare).forEach(([webhookName, ware]) => {
    app.post(`${constants.apiPathBit}/webhook/${webhookName}`, ...ware);
  });
}
