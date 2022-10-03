import React from "react";
import { VarbListUserVarbs } from "./appWide/VarbLists/VarbListUserVarbs";
import { UserListsPageGeneric } from "./UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

export function UserVarbListPage() {
  return (
    <UserListsPageGeneric themeName="userVarbList" saveWhat="custom variables">
      <UserListsGeneralSection
        themeName="userVarbList"
        storeName="userVarbListMain"
        title="Variables"
        makeListNode={(nodeProps) => <VarbListUserVarbs {...nodeProps} />}
      />
    </UserListsPageGeneric>
  );
}
