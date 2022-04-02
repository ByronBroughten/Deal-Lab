import { StylesProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { Normalize } from "styled-normalize";
import AnalyzerMain from "./App/components/AnalyzerMain";
import NotFound from "./App/components/general/NotFound";
import NavBar from "./App/components/NavBar";
import SectionTable from "./App/components/SectionTable";
import usePropertyAnalyzer, {
  AnalyzerContext,
} from "./App/modules/usePropertyAnalyzer";
import GlobalStyle from "./App/theme/globalStyles";
import theme, { Theme } from "./App/theme/Theme";

const App: React.FC = () => {
  const analyzerContext = usePropertyAnalyzer({
    main: true,
  });
  return (
    <React.StrictMode>
      <Normalize />
      <StylesProvider injectFirst>
        <Theme>
          <BrowserRouter>
            <AnalyzerContext.Provider value={analyzerContext}>
              <GlobalStyle />
              <Styled className="App-root">
                <NavBar className="NavBar-visible" />
                <div className="NavSpaceDiv-root"></div>
                <Routes>
                  <Route
                    path="/deals"
                    element={<SectionTable tableName="analysisTable" />}
                  />
                  {/* <Route path="/variables" element={<UserVarbsManager/>} /> */}
                  {/* <Route path="/lists" element={<UserListsManager/>} /> */}
                  <Route path="/not-found" element={<NotFound />} />
                  <Route path="/" element={<AnalyzerMain />} />
                  {/* <Route path="/" element={<Navigate replace to="/analyzer" />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Styled>
              <ToastContainer />
            </AnalyzerContext.Provider>
          </BrowserRouter>
        </Theme>
      </StylesProvider>
    </React.StrictMode>
  );
};
export default App;

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.light};

  .NavBar-visible {
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
