import { NavContainerPage } from "./general/NavContainerPage";
import { UserLists } from "./UserListEditorPage/UserLists";

export function UserListsPage() {
  return (
    <NavContainerPage activeBtnName="lists">
      <UserLists />
    </NavContainerPage>
  );
}
