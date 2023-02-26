import * as reactRouterDom from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import {
  ActiveDealFinancing,
  ActiveDealMgmt,
  ActiveDealProperty,
} from "./App/components/ActiveDealPage/ActiveDeal/PropertyGeneral/ActiveDealSections";
import { ActiveDealMain } from "./App/components/ActiveDealPage/ActiveDealMain";
import { FeUserMainTablePage } from "./App/components/FeUserMainTablePage";
import NotFound from "./App/components/general/NotFound";
import { DealSectionOutletPage } from "./App/components/NavContainerOutletPage";
import { UserListsPage } from "./App/components/UserListsPage";
import { UserVarbEditorPage } from "./App/components/UserVarbEditorPage";
import { constants } from "./App/Constants";
import {
  useSubscriptionState,
  useUserData,
} from "./App/modules/customHooks/useAuthAndUserData";
import theme from "./App/theme/Theme";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

export function Main() {
  useUserData();
  useSubscriptionState();
  const { feRoutes } = constants;
  // I need a Nav setup.
  return (
    <Styled className="App-root">
      <Routes>
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        <Route path={feRoutes.userVariables} element={<UserVarbEditorPage />} />
        <Route path={feRoutes.userLists} element={<UserListsPage />} />
        <Route
          path={feRoutes.activeDeal}
          element={<DealSectionOutletPage activeBtn="deal" />}
        >
          <Route index element={<ActiveDealMain />} />
          <Route
            path={feRoutes.activeProperty}
            element={<ActiveDealProperty />}
          />
          <Route
            path={feRoutes.activeFinancing}
            element={<ActiveDealFinancing />}
          />
          <Route path={feRoutes.activeMgmt} element={<ActiveDealMgmt />} />
        </Route>
        <Route
          path={feRoutes.subscribeSuccess}
          element={<Navigate to={feRoutes.activeDeal} />}
        />
        <Route
          path={feRoutes.authSuccess}
          element={<Navigate to={feRoutes.activeDeal} />}
        />

        <Route
          path={feRoutes.compare}
          element={<FeUserMainTablePage mainTableName={"dealMainTable"} />}
        />
        <Route
          path={feRoutes.propertyTable}
          element={
            <FeUserMainTablePage
              mainTableName={"propertyMainTable"}
              $themeName="property"
            />
          }
        />
        <Route
          path={feRoutes.loanTable}
          element={
            <FeUserMainTablePage
              mainTableName={"loanMainTable"}
              $themeName="loan"
            />
          }
        />
        <Route
          path={feRoutes.mgmtTable}
          element={
            <FeUserMainTablePage
              mainTableName={"mgmtMainTable"}
              $themeName="mgmt"
            />
          }
        />
        <Route path={feRoutes.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={feRoutes.termsOfService} element={<PrivacyPolicyPage />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route path={"/"} element={<Navigate to={feRoutes.activeDeal} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.light};
  * {
    font-family: "Source Sans Pro", "Roboto", Arial, sans-serif;
  }
  .NavBar-root {
    position: sticky;
  }
`;
