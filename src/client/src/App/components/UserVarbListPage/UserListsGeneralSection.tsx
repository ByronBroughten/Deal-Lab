import React from "react";
import styled from "styled-components";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import theme, { ThemeName } from "../../theme/Theme";
import { GeneralSection } from "../appWide/GeneralSection";
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
    <Styled themeName={themeName} className="UserListsGeneralSection-root">
      <div className="MainSection-entries">
        <UserListMainSection
          {...{
            title,
            themeName,
            storeName,
            makeListNode,
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled(GeneralSection)`
  .UserListMainSection-root {
    padding-bottom: ${theme.s2};
  }
  .UserListMain-saveBtn {
    width: 50%;
  }
`;
