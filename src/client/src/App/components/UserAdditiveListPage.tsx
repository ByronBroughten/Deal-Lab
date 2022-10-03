import React from "react";
import { VarbListSingleTime } from "./appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListOngoing } from "./appWide/VarbLists/VarbListOngoing";
import { UserListsPageGeneric } from "./UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

export function UserAdditiveListPage() {
  return (
    <UserListsPageGeneric themeName="userOngoingList" saveWhat="custom lists">
      <UserListsGeneralSection
        themeName="userSingleList"
        storeName="singleTimeListMain"
        title="One time cost lists"
        makeListNode={(nodeProps) => (
          <VarbListSingleTime {...{ ...nodeProps, menuType: "simple" }} />
        )}
      />
      <UserListsGeneralSection
        themeName="userOngoingList"
        storeName="ongoingListMain"
        title="Ongoing cost lists"
        makeListNode={(nodeProps) => (
          <VarbListOngoing {...{ ...nodeProps, menuType: "simple" }} />
        )}
      />
    </UserListsPageGeneric>
  );
}
