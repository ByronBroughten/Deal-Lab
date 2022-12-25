import React from "react";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { NavContainerPage } from "./general/NavContainerPage";
import { UserListEditor } from "./UserListEditorPage/UserListEditor";

export function UserAdditiveListPage() {
  return (
    <NavContainerPage activeBtnName="lists">
      <SectionPathContext.Provider value="userListEditorPage">
        <UserListEditor />
      </SectionPathContext.Provider>
    </NavContainerPage>
  );
}
