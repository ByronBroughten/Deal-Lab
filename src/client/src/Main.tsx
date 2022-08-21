import React from "react";
import ReactGA from "react-ga4";
import * as reactRouterDom from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import { ActiveDeal } from "./App/components/ActiveDeal";
import NotFound from "./App/components/general/NotFound";
import NavBar from "./App/components/NavBar";
import { constants } from "./App/Constants";
import {
  useAuthAndLogin,
  useSubscriptionState,
} from "./App/modules/customHooks/useAuthAndLogin";
import { useSetterSection } from "./App/sharedWithServer/stateClassHooks/useSetterSection";
import theme from "./App/theme/Theme";

ReactGA.initialize("G-19TRW4YTJL");
ReactGA.send("pageview");

export function Main() {
  const main = useSetterSection();
  const feUser = main.get.onlyChild("feUser");
  const { logout } = useAuthAndLogin();
  useSubscriptionState();
  const activeDealId = main.get.onlyChild("deal").feId;
  return (
    <Styled className="App-root">
      <NavBar {...{ logout }} />
      <div className="NavSpaceDiv-root"></div>
      <Routes>
        {/* <Route
          path="/deals"
          element={
            <TableStore feId={feUser.onlyChild("dealMainTable").feId} />
          }
        /> */}
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom)}

        {/* <Route path="/variables" element={<UserVarbsManager/>} /> */}
        {/* <Route path="/lists" element={<UserListsManager/>} /> */}

        <Route path="/not-found" element={<NotFound />} />
        <Route
          path={constants.subscriptionSuccessUrlEnd}
          element={<ActiveDeal feId={activeDealId} />}
        />
        <Route
          path={constants.auth.successUrlEnd}
          element={<ActiveDeal feId={activeDealId} loginSuccess={true} />}
        />
        <Route path="/" element={<ActiveDeal feId={activeDealId} />} />
        {/* <Route path="/" element={<Navigate replace to="/analyzer" />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <div className="DealStats-appInfo">
        Ultimate Deal Analyzer LLC | support@propertyanalyzer.app
      </div> */}
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
  .Footer-root {
    position: sticky;
    bottom: 0;
    z-index: 3;
  }
`;
