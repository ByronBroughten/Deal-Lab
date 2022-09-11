import React from "react";
import * as reactRouterDom from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDeal } from "./App/components/ActiveDeal";
import NotFound from "./App/components/general/NotFound";
import { NavBar } from "./App/components/NavBar";
import { UserAdditiveListPage } from "./App/components/UserAdditiveListPage";
import { UserOutputListPage } from "./App/components/UserOutputListPage";
import { UserVarbListPage } from "./App/components/UserVarbListPage";
import { constants } from "./App/Constants";
import { useSubscriptionState } from "./App/modules/customHooks/useAuthAndUserData";
import { useSetterSectionOnlyOne } from "./App/sharedWithServer/stateClassHooks/useSetterSection";
import theme from "./App/theme/Theme";

export function Main() {
  useSubscriptionState();
  const main = useSetterSectionOnlyOne("main");
  const activeDealId = main.get.onlyChild("deal").feId;
  const { feRoutes } = constants;
  return (
    <Styled className="App-root">
      <NavBar />
      <div className="NavSpaceDiv-root"></div>
      <Routes>
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
        <Route path={feRoutes.userVariables} element={<UserVarbListPage />} />
        <Route path={feRoutes.userLists} element={<UserAdditiveListPage />} />
        <Route path={feRoutes.userOutputs} element={<UserOutputListPage />} />
        <Route
          path={feRoutes.subscribeSuccess}
          element={<ActiveDeal feId={activeDealId} />}
        />
        <Route
          path={feRoutes.authSuccess}
          element={<ActiveDeal feId={activeDealId} loginSuccess={true} />}
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path={"/"} element={<ActiveDeal feId={activeDealId} />} />
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

  .NavBar-root {
    position: sticky;
  }
  .NavSpaceDiv-root {
    height: ${theme.s3};
  }
`;
