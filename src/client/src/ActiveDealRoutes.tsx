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
  <Route path={feRoutes.activeDeal} element={<ActiveDealController />}>
    <Route index element={<ActiveDealMain />} />
    <Route path={feRoutes.activeProperty} element={<ActiveDealProperty />} />
    <Route
      path={feRoutes.activePurchaseFi}
      element={<ActiveDealPurchaseFi />}
    />
    <Route path={feRoutes.activeRefi} element={<ActiveDealRefi />} />
    <Route path={feRoutes.activeMgmt} element={<ActiveDealMgmt />} />
  </Route>
);

function ActiveDealController() {
  const getters = useGetterSections();
  if (getters.hasActiveDeal()) {
    return <ActiveDealWrapper />;
  } else {
    return <Navigate to={feRoutes.account} />;
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
