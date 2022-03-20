import React from "react";
import { Route, Routes } from "react-router-dom";
import GlobalStyle from "./App/theme/globalStyles";
import NotFound from "./App/components/general/NotFound";
import usePropertyAnalyzer, {
  AnalyzerContext,
} from "./App/modules/usePropertyAnalyzer";
import styled from "styled-components";
import NavBar from "./App/components/NavBar";
import theme from "./App/theme/Theme";
import SectionTable from "./App/components/SectionTable";
import { ToastContainer } from "react-toastify";
import AnalyzerMain from "./App/components/AnalyzerMain";

export default function App() {
  const analyzerContext = usePropertyAnalyzer({
    main: true,
  });
  return (
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
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.plus.light};

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
