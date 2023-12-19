import * as reactRouterDom from "react-router-dom";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDealRoutes } from "./ActiveDealRoutes";
import { AccountPage } from "./App/components/AccountPage";
import { CreateDeal } from "./App/components/ActiveDealPage/CreateDeal";
import { AuthProtectedPage } from "./App/components/AuthProtectedPage";
import { CompareDealsPage } from "./App/components/DealComparePage/CompareDealsPage";
import { FooterNext } from "./App/components/Footer";
import { NavBar } from "./App/components/NavBar";
import { UserVarbEditorPage } from "./App/components/UserVarbEditorPage";
import { PageContent } from "./App/components/appWide/GeneralSection/PageContent";
import NotFound from "./App/components/general/NotFound";
import { useControlUserData } from "./App/modules/customHooks/useControlUserData";
import { useSubscriptions } from "./App/modules/customHooks/useSubscriptions";
import { useAutoSave } from "./App/stateClassHooks/useAutoSave";
import {
  useAddDeal,
  useEditDeal,
  useSolve,
} from "./App/stateClassHooks/useLoading";
import { nativeTheme } from "./App/theme/nativeTheme";
import { HandleAuth } from "./HandleAuth";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { TermsOfServicePage } from "./TermsOfServicePage";
import { UserComponentRoutes } from "./UserComponentRoutes";
import { feRoutes } from "./sharedWithServer/Constants/feRoutes";

export function Main() {
  useControlUserData();
  useSubscriptions();
  useAutoSave();
  useAddDeal();
  useEditDeal();
  useSolve();
  return (
    <Styled className="App-root">
      <NavBar />
      <PageContent>
        <Routes>
          <Route path={feRoutes.auth} element={<Outlet />}>
            {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
          </Route>
          <Route path={feRoutes.handleAuth} element={<HandleAuth />} />
          <Route path={"/"} element={<AuthProtectedPage />}>
            <Route index element={<Navigate to={feRoutes.account} />} />
            <Route path={feRoutes.account} element={<AccountPage />} />
            <Route path={feRoutes.createDeal} element={<CreateDeal />} />
            {ActiveDealRoutes}
            {UserComponentRoutes}
            <Route
              path={feRoutes.userVariables}
              element={<UserVarbEditorPage />}
            />
            <Route path={feRoutes.compare} element={<CompareDealsPage />} />
          </Route>
          <Route
            path={feRoutes.subscribeSuccess}
            element={<Navigate to={"/"} />}
          />
          <Route
            path={feRoutes.privacyPolicy}
            element={<PrivacyPolicyPage />}
          />
          <Route
            path={feRoutes.termsOfService}
            element={<TermsOfServicePage />}
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContent>
      <FooterNext />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 1;
  z-index: 5;
  overflow: visible;
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
