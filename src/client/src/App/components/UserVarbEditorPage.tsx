import React from "react";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import { NavContainerPage } from "./general/NavContainerPage";
import { UserVarbEditor } from "./UserVarbEditorPage/UserVarbEditor";

export function UserVarbEditorPage() {
  return (
    <NavContainerPage activeBtnName="variables">
      <SectionPathContext.Provider value="userVarbEditorPage">
        <UserVarbEditor />
      </SectionPathContext.Provider>
    </NavContainerPage>
  );
}
