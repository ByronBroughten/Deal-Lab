import { StylesProvider, ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSupertokens } from "./App/modules/initSupertokens";
import {
  SectionsContext,
  SectionsDispatchContext,
  useDealLabSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import { Theme } from "./App/theme/Theme";
import { GlobalFonts } from "./fonts/fonts";
import GlobalStyle from "./globalStyles";
import { Main } from "./Main";

initSupertokens();
const App: React.FC = () => {
  const { sectionsDispatch, ...sectionsContext } = useDealLabSections({
    storeSectionsLocally: true,
  });

  const muiTheme = createTheme();
  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StylesProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            <Theme>
              <BrowserRouter>
                <SectionsContext.Provider value={sectionsContext}>
                  <SectionsDispatchContext.Provider value={sectionsDispatch}>
                    <GlobalFonts />
                    <GlobalStyle />
                    <Main />
                    <ToastContainer />
                  </SectionsDispatchContext.Provider>
                </SectionsContext.Provider>
              </BrowserRouter>
            </Theme>
          </ThemeProvider>
        </StylesProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
