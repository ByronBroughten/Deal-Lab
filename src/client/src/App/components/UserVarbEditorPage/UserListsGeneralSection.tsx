import React from "react";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { ThemeName } from "../../theme/Theme";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { UserListMainSection } from "./UserListMainSection";

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndexWithArrStore">;
  title: string;
  makeListNode: MakeListNode;
};
export function UserListsGeneralSection({
  themeName,
  storeName,
  title,
  makeListNode,
}: Props) {
  return (
    <UserListMainSection
      {...{
        title,
        themeName,
        storeName,
        makeListNode,
      }}
    />
  );
}
