import React from "react";
import { VarbListUserVarbs } from "./appWide/VarbLists/VarbListUserVarbs";
import { UserListsGeneral } from "./UserListsGeneral";
import { UserListMainSection } from "./UserVarbListPage/UserListMainSection";

export function UserVarbListPage() {
  return (
    <UserListsGeneral themeName="userVarbList" saveWhat="custom variables">
      <UserListMainSection
        themeName="userVarbList"
        storeName="userVarbListMain"
        title="Variables"
        makeListNode={(nodeProps) => <VarbListUserVarbs {...nodeProps} />}
      />
    </UserListsGeneral>
  );
}
