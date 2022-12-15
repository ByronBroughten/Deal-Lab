import React from "react";
import * as reactRouterDom from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDeal } from "./App/components/ActiveDeal";
import { FeUserMainTablePage } from "./App/components/FeUserMainTablePage";
import NotFound from "./App/components/general/NotFound";
import { NavBar } from "./App/components/NavBar";
import { AppMenuDropdown } from "./App/components/NavBar/AppMenuDropdown";
import { UserAdditiveListPage } from "./App/components/UserAdditiveListPage";
import { UserOutputListPage } from "./App/components/UserOutputListPage";
import { UserVarbListPage } from "./App/components/UserVarbListPage";
import { constants } from "./App/Constants";
import { useSubscriptionState } from "./App/modules/customHooks/useAuthAndUserData";
import { useGetterSectionOnlyOne } from "./App/sharedWithServer/stateClassHooks/useGetterSection";
import theme from "./App/theme/Theme";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

export function Main() {
  useSubscriptionState();
  const main = useGetterSectionOnlyOne("main");
  const { feId: activeDealId } = main.onlyChild("activeDeal");
  const { feRoutes } = constants;
  return (
    <Styled className="App-root">
      <NavBar />
      <div className="App-container">
        <div className="App-NavSideBar">
          <div className="App-NavSideBarRelative">
            <AppMenuDropdown />
          </div>
        </div>
        <div className="App-Routes">
          <Routes>
            {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}
            <Route
              path={feRoutes.userVariables}
              element={<UserVarbListPage />}
            />
            <Route
              path={feRoutes.userLists}
              element={<UserAdditiveListPage />}
            />
            <Route
              path={feRoutes.userOutputs}
              element={<UserOutputListPage />}
            />
            <Route
              path={feRoutes.subscribeSuccess}
              element={<ActiveDeal feId={activeDealId} />}
            />
            <Route
              path={feRoutes.authSuccess}
              element={<ActiveDeal feId={activeDealId} loginSuccess={true} />}
            />
            <Route
              path={feRoutes.mainTables.deal}
              element={
                <FeUserMainTablePage
                  mainTableName={"dealMainTable"}
                  $themeName="deal"
                />
              }
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
            <Route
              path={feRoutes.privacyPolicy}
              element={<PrivacyPolicyPage />}
            />
            <Route
              path={feRoutes.termsOfService}
              element={<PrivacyPolicyPage />}
            />
            <Route path="/not-found" element={<NotFound />} />
            <Route path={"/"} element={<ActiveDeal feId={activeDealId} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
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

  .App-container {
    display: flex;
    margin-left: 150px;
  }
  .App-routes {
  }

  .App-NavSideBarRelative {
    .NavAppMenu-root {
    }
  }

  .App-NavSideBar {
    margin-top: 100px;
    height: 100%; /* Full-height: remove this if you want "auto" height */
    width: 150px; /* Set the width of the sidebar */
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 20px;
  }

  .NavBar-root {
    position: sticky;
  }
  .NavSpaceDiv-root {
    height: ${theme.s3};
  }
`;
