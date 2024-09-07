import { Route } from "react-router-dom";
import { feRoutes } from "../../../sharedWithServer/Constants/feRoutes";
import { ShowEqualsProvider } from "../customContexts/showEquals";
import { ListGroupEditor } from "../UserListEditorPage/ListGroupEditor";
import { UserComponents } from "../UserListEditorPage/UserComponents";
import { UserDataNeededPage } from "./AuthProtectedPage";

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
