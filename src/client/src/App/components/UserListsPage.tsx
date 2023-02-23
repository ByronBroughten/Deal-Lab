import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { NavContainerPage } from "./general/NavContainerPage";
import { UserLists } from "./UserListEditorPage/UserLists";

export function UserListsPage() {
  return (
    <NavContainerPage activeBtnName="lists">
      <SectionPathContext.Provider value="userListEditorPage">
        <UserLists />
      </SectionPathContext.Provider>
    </NavContainerPage>
  );
}
