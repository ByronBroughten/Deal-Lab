import { ListChildName } from "../../sharedWithServer/SectionsMeta/allSectionChildren";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

const listTypeNames = ["capEx", "ongoing", "singleTime"] as const;
type ListTypeName = typeof listTypeNames[number];

export const listTitles = {
  repairsListMain: "Repair List Templates",
  utilitiesListMain: "Utility List Templates",
  holdingCostsListMain: "Holding Cost Lists",
  capExListMain: "CapEx List Templates",
  closingCostsListMain: "Closing Cost List Templates",
  outputListMain: "Output Templates",
  singleTimeListMain: "Custom Cost Templates",
  ongoingListMain: "Custom Ongoing Cost Templates",
} as const;

type ListProps = Record<ListChildName, ListTypeName>;
const listTypes: ListProps = {
  repairsListMain: "singleTime",
  utilitiesListMain: "ongoing",
  holdingCostsListMain: "ongoing",
  capExListMain: "capEx",
  closingCostsListMain: "ongoing",
  outputListMain: "singleTime",
  singleTimeListMain: "singleTime",
  ongoingListMain: "ongoing",
};

type Props = { listName: ListChildName };

const listNodeMakers: Record<ListTypeName, MakeListNode> = {
  singleTime: (nodeProps) => (
    <VarbListSingleTime {...{ ...nodeProps, menuType: "editorPage" }} />
  ),
  ongoing: (nodeProps) => (
    <VarbListOngoing {...{ ...nodeProps, menuType: "editorPage" }} />
  ),
  capEx: (nodeProps) => (
    <VarbListCapEx
      {...{
        ...nodeProps,
        menuType: "editorPage",
      }}
    />
  ),
};

export function UserListsEditor({ listName }: Props) {
  const title = listTitles[listName];
  const listTypeName = listTypes[listName];
  const userListEditor = useSetterSectionOnlyOne("userListEditor");
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <SubSectionOpen>
        <UserEditorTitleRow
          titleText={title}
          sectionName="userListEditor"
          childNames={[listName]}
        />
        <div className="UserListEditor-listGroups">
          <ListGroupGeneric
            {...{
              titleText: title,
              listParentInfo: userListEditor.feInfo,
              listAsChildName: listName,
              makeListNode: listNodeMakers[listTypeName],
            }}
          />
        </div>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}
