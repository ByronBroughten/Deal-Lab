import React from "react";
import { Navigate, Route } from "react-router-dom";
import {
  ActiveDealMgmt,
  ActiveDealProperty,
  ActiveDealPurchaseFi,
  ActiveDealRefi,
} from "./App/components/ActiveDealPage/ActiveDeal/ActiveDealSections";
import { ActiveDealMain } from "./App/components/ActiveDealPage/ActiveDealMain";
import { UserDataNeededPage } from "./App/components/AuthProtectedPage";
import { DealModeProvider } from "./App/components/customContexts/dealModeContext";
import { feRoutes } from "./App/Constants/feRoutes";
import { useGetterSections } from "./App/sharedWithServer/stateClassHooks/useGetterSections";
import { IdOfSectionToSaveProvider } from "./App/sharedWithServer/stateClassHooks/useIdOfSectionToSave";

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
