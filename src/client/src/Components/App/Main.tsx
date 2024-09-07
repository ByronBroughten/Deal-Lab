import * as reactRouterDom from "react-router-dom";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { useControlUserData } from "../../modules/customHooks/useControlUserData";
import { useSubscriptions } from "../../modules/customHooks/useSubscriptions";
import { feRoutes } from "../../sharedWithServer/Constants/feRoutes";
import { useAutoSave } from "../../stateHooks/useAutoSave";
import { useAddDeal, useEditDeal, useSolve } from "../../stateHooks/useLoading";
import { nativeTheme } from "../../theme/nativeTheme";
import NotFound from "../general/NotFound";
import { PageContent } from "../general/PageContent";
import { CompareDealsPage } from "./DealComparePage/CompareDealsPage";
import { AccountPage } from "./Main/AccountPage";
import { ActiveDealRoutes } from "./Main/ActiveDealRoutes";
import { AuthProtectedPage } from "./Main/AuthProtectedPage";
import { CreateDeal } from "./Main/CreateDeal";
import { Footer } from "./Main/Footer";
import { HandleAuth } from "./Main/HandleAuth";
import { NavBar } from "./Main/NavBar";
import { PrivacyPolicyPage } from "./Main/PrivacyPolicyPage";
import { TermsOfServicePage } from "./Main/TermsOfServicePage";
import { UserComponentRoutes } from "./Main/UserComponentRoutes";
import { UserVarbEditorPage } from "./Main/UserVarbEditorPage";

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
      <Footer />
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
