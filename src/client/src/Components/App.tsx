import { CssBaseline, ThemeProvider } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { IdOfSectionToSaveProvider } from "../ContextsAndProviders/useIdOfSectionToSave";
import { MainStateProvider } from "../ContextsAndProviders/useMainState";
import { initSupertokens } from "../modules/initSupertokens";
import { GlobalFonts } from "../theme/fonts/fonts";
import {
  muiGlobalStyles,
  muiTheme,
  StyledComponentsGlobalStyle,
} from "../theme/globalStyles";
import { Theme } from "../theme/Theme";
import { ShowEqualsProvider } from "./App/customContexts/showEquals";
import { Main } from "./App/Main";
import { ModalProviders } from "./App/ModalProviders";
import { Modals } from "./App/Modals";

const styledComponentsGlobalStyle = <StyledComponentsGlobalStyle />;
const styledComponentsGlobalFonts = <GlobalFonts />;

initSupertokens();
export function App() {
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
}
