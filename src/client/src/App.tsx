import { CssBaseline, ThemeProvider } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { ShowEqualsProvider } from "./App/components/customContexts/showEquals";
import { initSupertokens } from "./App/modules/initSupertokens";
import { IdOfSectionToSaveProvider } from "./App/sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import {
  SectionsContext,
  SectionsDispatchContext,
  useDealLabSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import { Theme } from "./App/theme/Theme";
import { GlobalFonts } from "./fonts/fonts";
import {
  muiGlobalStyles,
  muiTheme,
  StyledComponentsGlobalStyle,
} from "./globalStyles";
import { Main } from "./Main";

const styledComponentsGlobalStyle = <StyledComponentsGlobalStyle />;
const styledComponentsGlobalFonts = <GlobalFonts />;

initSupertokens();
const App: React.FC = () => {
  const { sectionsDispatch, ...sectionsContext } = useDealLabSections({
    storeSectionsLocally: true,
  });

  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            <Theme>
              <BrowserRouter>
                <SectionsContext.Provider value={sectionsContext}>
                  <SectionsDispatchContext.Provider value={sectionsDispatch}>
                    <IdOfSectionToSaveProvider storeId="">
                      <ShowEqualsProvider showEqualsStatus="showAll">
                        <CssBaseline />
                        {muiGlobalStyles}
                        {styledComponentsGlobalFonts}
                        {styledComponentsGlobalStyle}
                        <Main />
                        <ToastContainer />
                      </ShowEqualsProvider>
                    </IdOfSectionToSaveProvider>
                  </SectionsDispatchContext.Provider>
                </SectionsContext.Provider>
              </BrowserRouter>
            </Theme>
          </ThemeProvider>
        </StyledEngineProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
