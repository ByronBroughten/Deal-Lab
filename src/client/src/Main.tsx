import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { ActiveDeal } from "./App/components/ActiveDeal";
import NotFound from "./App/components/general/NotFound";
import IndexTable from "./App/components/IndexTable";
import NavBar from "./App/components/NavBar";
import { auth } from "./App/modules/services/authService";
import { useSetterSection } from "./App/sharedWithServer/stateClassHooks/useSetterSection";
import theme from "./App/theme/Theme";

export function Main() {
  const main = useSetterSection();
  const logout = () => {
    auth.removeToken();
    main.resetToDefault();
  };
  const activeDealId = main.get.onlyChild("analysis").feId;
  return (
    <Styled className="App-root">
      <NavBar
        {...{
          feInfo: main.get.onlyChild("user").feInfo,
          logout,
        }}
      />
      <div className="NavSpaceDiv-root"></div>
      <Routes>
        <Route
          path="/deals"
          element={
            <IndexTable
              {...{
                feInfo: main.get.onlyChild("analysisTable").feInfo,
                indexName: "dealIndex",
              }}
            />
          }
        />
        {/* <Route path="/variables" element={<UserVarbsManager/>} /> */}
        {/* <Route path="/lists" element={<UserListsManager/>} /> */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/" element={<ActiveDeal feId={activeDealId} />} />
        {/* <Route path="/" element={<Navigate replace to="/analyzer" />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.light};

  .NavBar-root {
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
