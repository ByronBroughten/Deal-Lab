import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useGetterSections } from "../../../modules/stateHooks/useGetterSections";
import { feRoutes } from "../../../sharedWithServer/Constants/feRoutes";
import { IdOfSectionToSaveProvider } from "../../ContextsAndProviders/IdOfSectionToSaveProvider";
import { DealModeProvider } from "../customContexts/dealModeContext";
import { ActiveDealMain } from "./ActiveDealRoutes/ActiveDealMain";
import {
  ActiveDealMgmt,
  ActiveDealProperty,
  ActiveDealPurchaseFi,
  ActiveDealRefi,
} from "./ActiveDealRoutes/ActiveDealStuff/ActiveDealSections";
import { UserDataNeededPage } from "./AuthProtectedPage";

export const ActiveDealRoutes = (
  <Route path={feRoutes.activeDeal} element={<ActiveDealMainController />}>
    <Route index element={<ActiveDealMain />} />
    <Route
      path={feRoutes.activeProperty}
      element={
        <ActiveDealChildController>
          <ActiveDealProperty />
        </ActiveDealChildController>
      }
    />
    <Route
      path={feRoutes.activePurchaseFi}
      element={
        <ActiveDealChildController>
          <ActiveDealPurchaseFi />
        </ActiveDealChildController>
      }
    />
    <Route
      path={feRoutes.activeRefi}
      element={
        <ActiveDealChildController>
          <ActiveDealRefi />
        </ActiveDealChildController>
      }
    />
    <Route
      path={feRoutes.activeMgmt}
      element={
        <ActiveDealChildController>
          <ActiveDealMgmt />
        </ActiveDealChildController>
      }
    />
  </Route>
);

function ActiveDealMainController() {
  const getters = useGetterSections();
  const session = getters.oneAndOnly("sessionStore");

  const isCreatingDeal = session.valueNext("isCreatingDeal");
  if (getters.hasActiveDeal()) {
    return <ActiveDealWrapper />;
  } else if (isCreatingDeal) {
    return <UserDataNeededPage />;
  } else {
    return <Navigate to={feRoutes.account} />;
  }
}

type ChildControllerProps = { children: React.ReactElement };
function ActiveDealChildController({ children }: ChildControllerProps) {
  const getters = useGetterSections();
  if (getters.hasActiveDeal()) {
    return children;
  } else {
    return <Navigate to={feRoutes.activeDeal} />;
  }
}

function ActiveDealWrapper() {
  const getters = useGetterSections();
  const deal = getters.getActiveDeal();
  return (
    <DealModeProvider dealMode={deal.valueNext("dealMode")}>
      <IdOfSectionToSaveProvider storeId={deal.mainStoreId}>
        <UserDataNeededPage />
      </IdOfSectionToSaveProvider>
    </DealModeProvider>
  );
}
