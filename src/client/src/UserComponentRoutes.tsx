import { Route } from "react-router-dom";
import { UserDataNeededPage } from "./App/components/AuthProtectedPage";
import { ListGroupEditor } from "./App/components/UserListEditorPage/ListGroupEditor";
import { UserComponents } from "./App/components/UserListEditorPage/UserComponents";
import { feRoutes } from "./App/Constants/feRoutes";

const listRoutes = [
  "repairsListMain",
  "utilitiesListMain",
  "capExListMain",
  "closingCostsListMain",
  "singleTimeListMain",
  "ongoingListMain",
] as const;

export const UserComponentRoutes = (
  <Route path={feRoutes.components} element={<UserDataNeededPage />}>
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
