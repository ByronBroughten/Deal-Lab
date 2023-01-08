import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

export function UserListEditor() {
  const userListEditor = useSetterSectionOnlyOne("userListEditor");
  return (
    <Styled>
      <UserEditorTitleRow
        titleText="Cost Lists"
        sectionName="userListEditor"
        childNames={["singleTimeListMain", "ongoingListMain"]}
      />
      <div className="UserListEditor-listGroups">
        <ListGroupGeneric
          {...{
            titleText: "Upfront",
            listParentInfo: userListEditor.feInfo,
            listAsChildName: "singleTimeListMain",
            makeListNode: (nodeProps) => (
              <VarbListSingleTime
                {...{ ...nodeProps, menuType: "editorPage" }}
              />
            ),
          }}
        />
        <ListGroupGeneric
          {...{
            titleText: "Ongoing",
            listParentInfo: userListEditor.feInfo,
            listAsChildName: "ongoingListMain",
            makeListNode: (nodeProps) => (
              <VarbListOngoing {...{ ...nodeProps, menuType: "editorPage" }} />
            ),
          }}
        />
      </div>
    </Styled>
  );
}

const Styled = styled(OuterMainSection)`
  .UserListEditor-listGroups {
    margin-top: ${theme.s35};
  }
`;
