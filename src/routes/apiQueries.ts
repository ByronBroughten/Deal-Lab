import express from "express";
import { apiQueriesShared } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { addSectionWare } from "./apiQueries/addSection";
import { deleteSectionWare } from "./apiQueries/deleteSection";
import { upgradeUserToProWare } from "./apiQueries/getProPaymentLink";
import { getSectionWare } from "./apiQueries/getSection";
import { getUserDataWare } from "./apiQueries/getUserData";
import { loginWare } from "./apiQueries/login";
import { makeSessionWare } from "./apiQueries/makeSession";
import { nextRegisterWare } from "./apiQueries/register";
import { replaceSectionArrWare } from "./apiQueries/replaceSectionArr";
import { stripeWebhookWare } from "./apiQueries/stripeWebhooks";
import { updateSectionWare } from "./apiQueries/updateSection";

const endpointWare: Record<ApiQueryName, any> = {
  register: nextRegisterWare,
  login: loginWare,
  addSection: addSectionWare,
  updateSection: updateSectionWare,
  getSection: getSectionWare,
  deleteSection: deleteSectionWare,
  replaceSectionArr: replaceSectionArrWare,
  getProPaymentLink: upgradeUserToProWare,
  getUserData: getUserDataWare,
  makeSession: makeSessionWare,
} as const;

const apiQueriesServer = express.Router();

for (const [queryName, ware] of Obj.entries(endpointWare)) {
  apiQueriesServer.post(apiQueriesShared[queryName].pathBit, ...ware);
}

const webhookWare = {
  stripe: stripeWebhookWare,
} as const;

for (const [webhookName, ware] of Obj.entries(webhookWare)) {
  apiQueriesServer.post(`/webhook/${webhookName}`, ...ware);
}

export default apiQueriesServer;
