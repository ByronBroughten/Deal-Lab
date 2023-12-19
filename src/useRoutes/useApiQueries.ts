import { Express } from "express";

import { apiQueriesShared } from "../client/src/sharedWithServer/apiQueriesShared";
import { ApiQueryName } from "../client/src/sharedWithServer/apiQueriesShared/apiQueriesSharedTypes";
import { Obj } from "../client/src/sharedWithServer/utils/Obj";
import { addSectionWare } from "./routes/addSection";
import { makeSessionWare } from "./routes/apiQueriesTestTools/makeSession";
import { deleteSectionWare } from "./routes/deleteSection";
import { getArchivedDealsWare } from "./routes/getArchivedDeals";
import { getCustomerPortalUrlWare } from "./routes/getCustomerPortalUrl";
import { getNewDealWare } from "./routes/getNewDeal";
import { getProPaymentUrlWare } from "./routes/getProPaymentUrl";
import { getSectionWare } from "./routes/getSection";
import { subscriptionDataWare } from "./routes/getSubscriptionData";
import { getUserDataWare } from "./routes/getUserData";
import { replaceSectionArrWare } from "./routes/replaceSectionArrs";
import { updateSectionWare } from "./routes/updateSection";
import { updateSectionsWare } from "./routes/updateSections";

export function useApiQueries(app: Express): void {
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

  for (const [queryName, ware] of Obj.entries(endpointWare)) {
    app.post(`${apiQueriesShared[queryName].pathRoute}`, ...ware);
  }
}
