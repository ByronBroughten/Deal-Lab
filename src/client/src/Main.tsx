import * as reactRouterDom from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDealRoutes } from "./ActiveDealRoutes";
import { AccountPage } from "./App/components/AccountPage";
import { AuthProtectedPage } from "./App/components/AuthProtectedPage";
import { DealCompareSection } from "./App/components/DealComparePage/DealCompareSection";
import NotFound from "./App/components/general/NotFound";
import { NavBarOutletPage } from "./App/components/NavBarOutletPage";
import { UserVarbEditorPage } from "./App/components/UserVarbEditorPage";
import { feRoutes } from "./App/Constants/feRoutes";
import { useControlUserData } from "./App/modules/customHooks/UserDataActor";
import { useSubscriptions } from "./App/modules/customHooks/useSubscriptions";
import theme from "./App/theme/Theme";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { UserComponentRoutes } from "./UserComponentRoutes";

export function Main() {
  useControlUserData();
  useSubscriptions();
  return (
    <Styled className="App-root">
      <Routes>
        <Route path={feRoutes.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={feRoutes.termsOfService} element={<PrivacyPolicyPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path={feRoutes.auth} element={<NavBarOutletPage />}>
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
          <Route path={feRoutes.compare} element={<DealCompareSection />} />
          <Route path={feRoutes.account} element={<AccountPage />} />
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
