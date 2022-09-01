import React from "react";
import { VarbListSingleTime } from "./appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListOngoing } from "./appWide/VarbLists/VarbListOngoing";
import { UserListsGeneral } from "./UserListsGeneral";
import { UserListMainSection } from "./UserVarbListPage/UserListMainSection";

export function UserAdditiveListPage() {
  return (
    <UserListsGeneral themeName="userOngoingList" saveWhat="custom lists">
      <UserListMainSection
        themeName="userSingleList"
        storeName="singleTimeListMain"
        title="One time cost lists"
        makeListNode={(nodeProps) => <VarbListSingleTime {...nodeProps} />}
      />
      <UserListMainSection
        themeName="userOngoingList"
        storeName="ongoingListMain"
        title="Ongoing cost lists"
        makeListNode={(nodeProps) => <VarbListOngoing {...nodeProps} />}
      />
    </UserListsGeneral>
  );
}
