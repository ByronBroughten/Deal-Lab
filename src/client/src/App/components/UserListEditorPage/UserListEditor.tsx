import styled from "styled-components";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../theme/Theme";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

// change the arrQuerier route to accept multiple arrs
// change the ArrQuerier to accept an array of arrs
// change the editor page childNames to match storeNames
// make generalizable save and discard changes
// logic that works with both editors

// Or, copy and paste the code and add a bunch
// of duplicate stuff to make it work.

export function UserListEditor() {
  const userListEditor = useSetterSectionOnlyOne("userListEditor");
  return (
    <Styled>
      <UserEditorTitleRow
        titleText="Cost Lists"
        saveChanges={() => {}}
        discardChanges={() => {}}
        areSaved={true}
      />
      <div className="UserListEditor-listGroups">
        <ListGroupGeneric
          {...{
            titleText: "Upfront",
            listParentInfo: userListEditor.feInfo,
            listAsChildName: "singleTimeList",
            makeListNode: (nodeProps) => (
              <VarbListSingleTime {...{ ...nodeProps, menuType: "simple" }} />
            ),
          }}
        />
        <ListGroupGeneric
          {...{
            titleText: "Ongoing",
            listParentInfo: userListEditor.feInfo,
            listAsChildName: "ongoingList",
            makeListNode: (nodeProps) => (
              <VarbListOngoing {...{ ...nodeProps, menuType: "simple" }} />
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
