import { StylesProvider } from "@material-ui/core";
import React from "react";
import ReactGA from "react-ga4";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import { SuperTokensWrapper } from "supertokens-auth-react";
import { initSupertokens } from "./App/modules/initSupertokens";
import { SectionPathContext } from "./App/sharedWithServer/stateClassHooks/useSectionContextName";
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
ReactGA.initialize("G-19TRW4YTJL");
ReactGA.send("pageview");
const App: React.FC = () => {
  const { sectionsDispatch, ...sectionsContext } = useDealLabSections({
    storeSectionsLocally: true,
  });

  return (
    <SuperTokensWrapper>
      <React.StrictMode>
        <Normalize />
        <StylesProvider injectFirst>
          <Theme>
            <BrowserRouter>
              <SectionsContext.Provider value={sectionsContext}>
                <SectionsDispatchContext.Provider value={sectionsDispatch}>
                  <SectionPathContext.Provider value="default">
                    <GlobalFonts />
                    <GlobalStyle />
                    <Main />
                    <ToastContainer />
                  </SectionPathContext.Provider>
                </SectionsDispatchContext.Provider>
              </SectionsContext.Provider>
            </BrowserRouter>
          </Theme>
        </StylesProvider>
      </React.StrictMode>
    </SuperTokensWrapper>
  );
};
export default App;
