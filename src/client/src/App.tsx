import { CssBaseline, ThemeProvider } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { ModalProviders } from "./App/components/ModalProviders";
import { Modals } from "./App/components/Modals";
import { ShowEqualsProvider } from "./App/components/customContexts/showEquals";
import { initSupertokens } from "./App/modules/initSupertokens";
import { IdOfSectionToSaveProvider } from "./App/sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { MainStateProvider } from "./App/sharedWithServer/stateClassHooks/useMainState";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";
import { GlobalFonts } from "./fonts/fonts";
import {
  StyledComponentsGlobalStyle,
  muiGlobalStyles,
  muiTheme,
} from "./globalStyles";

const styledComponentsGlobalStyle = <StyledComponentsGlobalStyle />;
const styledComponentsGlobalFonts = <GlobalFonts />;

initSupertokens();
const App: React.FC = () => {
  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            <Theme>
              <BrowserRouter>
                <MainStateProvider>
                  <IdOfSectionToSaveProvider storeId="">
                    <ShowEqualsProvider showEqualsStatus="showAll">
                      <CssBaseline />
                      {muiGlobalStyles}
                      {styledComponentsGlobalFonts}
                      {styledComponentsGlobalStyle}
                      <ModalProviders>
                        <Modals />
                        <Main />
                      </ModalProviders>
                      <ToastContainer />
                    </ShowEqualsProvider>
                  </IdOfSectionToSaveProvider>
                </MainStateProvider>
              </BrowserRouter>
            </Theme>
          </ThemeProvider>
        </StyledEngineProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
