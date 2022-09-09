import express from "express";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import {
  stripeWebhookTestWare,
  stripeWebhookWare,
} from "./apiQueries/stripeWebhooks";

const webhooks = express.Router();
const webhookWare = {
  stripe: stripeWebhookWare,
  stripeTest: stripeWebhookTestWare,
} as const;

for (const [webhookName, ware] of Obj.entries(webhookWare)) {
  webhooks.post(`/webhook/${webhookName}`, ...ware);
}
export const webhookQueries = webhooks;
