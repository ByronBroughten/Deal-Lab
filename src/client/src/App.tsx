import { StylesProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { constants } from "./App/Constants";
import {
  SectionsContext,
  useSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import GlobalStyle from "./App/theme/globalStyles";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
    appName: constants.appName,
    apiDomain: constants.apiPathFull,
    websiteDomain: constants.clientUrlBase,
  },
  recipeList: [EmailPassword.init(), Session.init()],
});

const App: React.FC = () => {
  const sectionsContext = useSections({ storeSectionsLocally: true });
  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StylesProvider injectFirst>
          <Theme>
            <BrowserRouter>
              <SectionsContext.Provider value={sectionsContext}>
                <GlobalStyle />
                <Main />
                <ToastContainer />
              </SectionsContext.Provider>
            </BrowserRouter>
          </Theme>
        </StylesProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
