import { Express } from "express";
import { constant } from "../../client/src/sharedWithServer/Constants";
import { ApiQueryName } from "../../client/src/sharedWithServer/Constants/queryPaths";
import { Obj } from "../../client/src/sharedWithServer/utils/Obj";
import { addSectionWare } from "./addSection";
import { makeSessionWare } from "./apiQueriesTestTools/makeSession";
import { deleteSectionWare } from "./deleteSection";
import { getArchivedDealsWare } from "./getArchivedDeals";
import { getCustomerPortalUrlWare } from "./getCustomerPortalUrl";
import { getNewDealWare } from "./getNewDeal";
import { getProPaymentUrlWare } from "./getProPaymentUrl";
import { getSectionWare } from "./getSection";
import { subscriptionDataWare } from "./getSubscriptionData";
import { getUserDataWare } from "./getUserData";
import { replaceSectionArrWare } from "./replaceSectionArrs";
import { updateSectionWare } from "./updateSection";
import { updateSectionsWare } from "./updateSections";

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
    app.post(`${constant("pathRoutes")[queryName]}`, ...ware);
  }
}
