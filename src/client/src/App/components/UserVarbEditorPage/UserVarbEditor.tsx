import React from "react";
import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

export function UserVarbEditor() {
  const userVarbEditor = useSetterSectionOnlyOne("userVarbEditor");
  return (
    <Styled className="UserListMainSection-root">
      <UserEditorTitleRow
        {...{
          titleText: "Variables",
          sectionName: "userVarbEditor",
          childNames: ["userVarbListMain"],
        }}
      />
      <MainSectionBody>
        <ListGroupLists
          {...{
            feIds: userVarbEditor.childFeIds("userVarbListMain"),
            addList: () => userVarbEditor.addChild("userVarbListMain"),
            makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(OuterMainSection)``;
