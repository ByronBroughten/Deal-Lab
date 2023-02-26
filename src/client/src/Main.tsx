import * as reactRouterDom from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDealPage } from "./App/components/ActiveDealPage";
import { DealPropertyPage } from "./App/components/DealPropertyPage";
import { FeUserMainTablePage } from "./App/components/FeUserMainTablePage";
import NotFound from "./App/components/general/NotFound";
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
      {/* <NavBar /> */}
      <Routes>
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        <Route path={feRoutes.userVariables} element={<UserVarbEditorPage />} />
        <Route path={feRoutes.userLists} element={<UserListsPage />} />
        <Route path={feRoutes.activeDeal} element={<ActiveDealPage />} />
        <Route path={feRoutes.subscribeSuccess} element={<ActiveDealPage />} />
        <Route path={feRoutes.authSuccess} element={<ActiveDealPage />} />
        <Route path={feRoutes.activeProperty} element={<DealPropertyPage />} />

        <Route
          path={feRoutes.compare}
          element={<FeUserMainTablePage mainTableName={"dealMainTable"} />}
        />
        <Route
          path={feRoutes.mainTables.property}
          element={
            <FeUserMainTablePage
              mainTableName={"propertyMainTable"}
              $themeName="property"
            />
          }
        />
        <Route
          path={feRoutes.mainTables.loan}
          element={
            <FeUserMainTablePage
              mainTableName={"loanMainTable"}
              $themeName="loan"
            />
          }
        />
        <Route
          path={feRoutes.mainTables.mgmt}
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
