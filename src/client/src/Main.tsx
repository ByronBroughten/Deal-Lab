import * as reactRouterDom from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDealRoutes } from "./ActiveDealRoutes";
import { AuthProtectedPage } from "./App/components/AuthProtectedPage";
import { FeUserMainTablePage } from "./App/components/FeUserMainTablePage";
import NotFound from "./App/components/general/NotFound";
import { NavBarOutletPage } from "./App/components/NavBarOutletPage";
import { UserVarbEditorPage } from "./App/components/UserVarbEditorPage";
import { feRoutes } from "./App/Constants/feRoutes";
import {
  useSubscriptionState,
  useUserData,
} from "./App/modules/customHooks/useAuthAndUserData";
import theme from "./App/theme/Theme";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { UserComponentRoutes } from "./UserComponentRoutes";

export function Main() {
  useUserData();
  useSubscriptionState();
  return (
    <Styled className="App-root">
      <Routes>
        <Route path={feRoutes.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={feRoutes.termsOfService} element={<PrivacyPolicyPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path={"/auth"} element={<NavBarOutletPage />}>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        </Route>
        <Route path={feRoutes.authSuccess} element={<Navigate to={"/"} />} />
        <Route
          path={feRoutes.subscribeSuccess}
          element={<Navigate to={"/"} />}
        />
        <Route path={"/"} element={<AuthProtectedPage />}>
          <Route index element={<Navigate to={feRoutes.activeDeal} />} />
          {ActiveDealRoutes}
          {UserComponentRoutes}
          <Route
            path={feRoutes.userVariables}
            element={<UserVarbEditorPage />}
          />
          <Route
            path={feRoutes.compare}
            element={<FeUserMainTablePage mainTableName={"dealMainTable"} />}
          />
        </Route>
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
