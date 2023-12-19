import { Route } from "react-router-dom";
import { UserDataNeededPage } from "./App/components/AuthProtectedPage";
import { ListGroupEditor } from "./App/components/UserListEditorPage/ListGroupEditor";
import { UserComponents } from "./App/components/UserListEditorPage/UserComponents";
import { ShowEqualsProvider } from "./App/components/customContexts/showEquals";
import { feRoutes } from "./sharedWithServer/Constants/feRoutes";

const listRoutes = [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "onetimeListMain",
  "ongoingListMain",
] as const;

export const UserComponentRoutes = (
  <Route
    path={feRoutes.components}
    element={
      <ShowEqualsProvider showEqualsStatus="showPure">
        <UserDataNeededPage />
      </ShowEqualsProvider>
    }
  >
    <Route index element={<UserComponents />} />
    {listRoutes.map((routeName) => (
      <Route
        key={routeName}
        path={feRoutes[routeName]}
        element={<ListGroupEditor listName={routeName} />}
      />
    ))}
  </Route>
);
