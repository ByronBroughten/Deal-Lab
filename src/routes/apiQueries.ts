import express from "express";
import { apiQueriesShared } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { addSectionWare } from "./apiQueries/addSection";
import { makeSessionWare } from "./apiQueries/apiQueriesTestTools/makeSession";
import { deleteSectionWare } from "./apiQueries/deleteSection";
import { getArchivedDealsWare } from "./apiQueries/getArchivedDeals";
import { getCustomerPortalUrlWare } from "./apiQueries/getCustomerPoartalUrl";
import { getNewDealWare } from "./apiQueries/getNewDeal";
import { getProPaymentUrlWare } from "./apiQueries/getProPaymentUrl";
import { getSectionWare } from "./apiQueries/getSection";
import { subscriptionDataWare } from "./apiQueries/getSubscriptionData";
import { getUserDataWare } from "./apiQueries/getUserData";
import { replaceSectionArrWare } from "./apiQueries/replaceSectionArrs";
import { updateSectionWare } from "./apiQueries/updateSection";
import { updateSectionsWare } from "./apiQueries/updateSections";

const endpointWare: Record<ApiQueryName, any> = {
  getArchivedDeals: getArchivedDealsWare,
  addSection: addSectionWare,
  updateSection: updateSectionWare,
  updateSections: updateSectionsWare,
  getSection: getSectionWare,
  deleteSection: deleteSectionWare,
  replaceSectionArrs: replaceSectionArrWare,
  getProPaymentUrl: getProPaymentUrlWare,
  getCustomerPortalUrl: getCustomerPortalUrlWare,
  getUserData: getUserDataWare,
  getSubscriptionData: subscriptionDataWare,
  makeSession: makeSessionWare,
  getNewDeal: getNewDealWare,
} as const;

const apiQueries = express.Router();
for (const [queryName, ware] of Obj.entries(endpointWare)) {
  apiQueries.post(apiQueriesShared[queryName].pathBit, ...ware);
}
export const apiQueriesServer = apiQueries;
