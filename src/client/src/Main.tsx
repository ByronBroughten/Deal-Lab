import * as reactRouterDom from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDealRoutes } from "./ActiveDealRoutes";
import { AccountPage } from "./App/components/AccountPage";
import {
  AuthProtectedPage,
  UserDataNeededPage,
} from "./App/components/AuthProtectedPage";
import { DealCompareSection } from "./App/components/DealComparePage/DealCompareSection";
import NotFound from "./App/components/general/NotFound";
import { NavBarOutletPage } from "./App/components/NavBarOutletPage";
import { UserVarbEditorPage } from "./App/components/UserVarbEditorPage";
import { feRoutes } from "./App/Constants/feRoutes";
import { useSubscriptions } from "./App/modules/customHooks/useSubscriptions";
import { useControlUserData } from "./App/modules/SectionActors/UserDataActor";
import { useAutoSave } from "./App/sharedWithServer/stateClassHooks/useAutoSaveSections";
import { nativeTheme } from "./App/theme/nativeTheme";
import { LoginSuccess } from "./LoginSuccess";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { UserComponentRoutes } from "./UserComponentRoutes";

export function Main() {
  useControlUserData();
  useSubscriptions();
  useAutoSave();
  return (
    <Styled className="App-root">
      <Routes>
        <Route path={feRoutes.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={feRoutes.termsOfService} element={<PrivacyPolicyPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path={feRoutes.auth} element={<NavBarOutletPage />}>
          {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        </Route>
        <Route path={feRoutes.authSuccess} element={<LoginSuccess />} />
        <Route
          path={feRoutes.subscribeSuccess}
          element={<Navigate to={"/"} />}
        />
        <Route path={"/"} element={<AuthProtectedPage />}>
          <Route index element={<Navigate to={feRoutes.account} />} />
          <Route path={feRoutes.account} element={<AccountPage />} />
          {ActiveDealRoutes}
          {UserComponentRoutes}
          <Route path={feRoutes.userVariables} element={<UserDataNeededPage />}>
            <Route index element={<UserVarbEditorPage />} />
          </Route>
          <Route path={feRoutes.compare} element={<UserDataNeededPage />}>
            <Route index element={<DealCompareSection />} />
          </Route>
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
  background-color: ${nativeTheme.light};
  * {
    font-family: "Source Sans Pro", "Roboto", Arial, sans-serif;
  }
  .NavBar-root {
    position: sticky;
  }
`;
