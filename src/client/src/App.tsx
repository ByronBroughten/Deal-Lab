import { StylesProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Normalize } from "styled-normalize";
import usePropertyAnalyzer, {
  AnalyzerContext,
} from "./App/modules/usePropertyAnalyzer";
import {
  SectionsContext,
  useSections,
} from "./App/sharedWithServer/StateHooks/useSections";
import GlobalStyle from "./App/theme/globalStyles";
import { Theme } from "./App/theme/Theme";
import { Main } from "./Main";

const App: React.FC = () => {
  const analyzerContext = usePropertyAnalyzer({
    main: true,
  });

  const sectionsContext = useSections({ storeSectionsLocally: true });
  return (
    <React.StrictMode>
      <Normalize />
      <StylesProvider injectFirst>
        <Theme>
          <BrowserRouter>
            <AnalyzerContext.Provider value={analyzerContext}>
              <SectionsContext.Provider value={sectionsContext}>
                <GlobalStyle />
                <Main />
                <ToastContainer />
              </SectionsContext.Provider>
            </AnalyzerContext.Provider>
          </BrowserRouter>
        </Theme>
      </StylesProvider>
    </React.StrictMode>
  );
};
export default App;
