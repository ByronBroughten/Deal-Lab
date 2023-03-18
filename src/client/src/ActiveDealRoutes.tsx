import { Route } from "react-router-dom";
import {
  ActiveDealFinancing,
  ActiveDealMgmt,
  ActiveDealProperty,
} from "./App/components/ActiveDealPage/ActiveDeal/PropertyGeneral/ActiveDealSections";
import { ActiveDealMain } from "./App/components/ActiveDealPage/ActiveDealMain";
import { feRoutes } from "./App/Constants/feRoutes";

export const ActiveDealRoutes = (
  <>
    <Route path={feRoutes.activeDeal} element={<ActiveDealMain />} />
    <Route path={feRoutes.activeProperty} element={<ActiveDealProperty />} />
    <Route path={feRoutes.activeFinancing} element={<ActiveDealFinancing />} />
    <Route path={feRoutes.activeMgmt} element={<ActiveDealMgmt />} />
  </>
);
