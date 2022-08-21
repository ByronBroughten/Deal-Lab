import { StylesProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import supertokens, { SuperTokensWrapper } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "./App/Constants";
import {
  SectionsContext,
  useSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import GlobalStyle from "./App/theme/globalStyles";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";

supertokens.init({
  appInfo: constants.superTokens.appInfo,
  recipeList: [
    // EmailPassword.init(), Session.init()
    ThirdPartyEmailPassword.init({
      override: {
        functions(original) {
          return {
            ...original,
          };
        },
      },

      getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS") {
          return constants.auth.successUrl;
        }
      },
      signInAndUpFeature: {
        signUpForm: {
          formFields: [
            {
              id: "userName",
              label: "Name",
              placeholder: "What should we call you?",
            },
          ],
        },
      },
      emailVerificationFeature: {
        mode: "REQUIRED",
      },
    }),
    Session.init(),
  ],
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
