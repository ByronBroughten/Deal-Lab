import express from "express";
import { apiQueriesShared } from "../client/src/App/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/App/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/App/sharedWithServer/utils/Obj";
import { addSectionWare } from "./apiQueries/addSection";
import { makeSessionWare } from "./apiQueries/apiQueriesTestTools/makeSession";
import { deleteSectionWare } from "./apiQueries/deleteSection";
import { getProPaymentUrlWare } from "./apiQueries/getProPaymentUrl";
import { getSectionWare } from "./apiQueries/getSection";
import { subscriptionDataWare } from "./apiQueries/getSubscriptionData";
import { getTableRowsWare } from "./apiQueries/getTableRows";
import { getUserDataWare } from "./apiQueries/getUserData";
import { replaceSectionArrWare } from "./apiQueries/replaceSectionArr";
import { updateSectionWare } from "./apiQueries/updateSection";

const endpointWare: Record<ApiQueryName, any> = {
  addSection: addSectionWare,
  updateSection: updateSectionWare,
  getSection: getSectionWare,
  deleteSection: deleteSectionWare,
  replaceSectionArr: replaceSectionArrWare,
  getProPaymentUrl: getProPaymentUrlWare,
  getUserData: getUserDataWare,
  getSubscriptionData: subscriptionDataWare,
  makeSession: makeSessionWare,
  getTableRows: getTableRowsWare,
} as const;

const apiQueries = express.Router();
for (const [queryName, ware] of Obj.entries(endpointWare)) {
  apiQueries.post(apiQueriesShared[queryName].pathBit, ...ware);
}
export const apiQueriesServer = apiQueries;
