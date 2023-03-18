import { Route } from "react-router-dom";
import { UserComponents } from "./App/components/UserListEditorPage/UserComponents";
import { UserListsEditor } from "./App/components/UserListEditorPage/UserListsEditor";
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
  <>
    <Route path={feRoutes.components} element={<UserComponents />} />
    {listRoutes.map((routeName) => (
      <Route
        key={routeName}
        path={feRoutes[routeName]}
        element={<UserListsEditor listName={routeName} />}
      />
    ))}
  </>
);
