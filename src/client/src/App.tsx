import { StylesProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import {
  SectionsContext,
  useSections,
} from "./App/sharedWithServer/stateClassHooks/useSections";
import GlobalStyle from "./App/theme/globalStyles";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";

const App: React.FC = () => {
  const sectionsContext = useSections({ storeSectionsLocally: true });
  return (
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
  );
};
export default App;
