import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import GlobalStyle from "./App/theme/globalStyles";
import AnalyzerMain from "./App/components/AnalyzerMain";
import NotFound from "./App/components/general/NotFound";
import UserVarbsManager from "./App/components/UserVarbsManager";
import UserListsManager from "./App/components/UserListsManager";
import usePropertyAnalyzer, {
  AnalyzerContext,
} from "./App/modules/usePropertyAnalyzer";
import styled from "styled-components";
import NavBar from "./App/components/NavBar";
import theme from "./App/theme/Theme";
import SectionTable from "./App/components/SectionTable";

export default function App() {
  const analyzerContext = usePropertyAnalyzer({
    main: true,
  });

  return (
    <AnalyzerContext.Provider value={analyzerContext}>
      <GlobalStyle />
      <NavBar />
      <Styled className="App-root">
        <Routes>
          <Route path="/analyzer" element={<AnalyzerMain />} />
          <Route
            path="/analyses"
            element={<SectionTable tableName="analysisTable" />}
          />
          {/* <Route path="/variables" element={<UserVarbsManager/>} /> */}
          {/* <Route path="/lists" element={<UserListsManager/>} /> */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/" element={<Navigate replace to="/analyzer" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Styled>
    </AnalyzerContext.Provider>
  );
}

const Styled = styled.div`
  padding-top: calc(${theme.navBar.height} + ${theme.s4});
  background-color: ${theme.plus.light};
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
