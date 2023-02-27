import { ListChildName } from "../../sharedWithServer/SectionsMeta/allSectionChildren";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { useGoToPage } from "../appWide/customHooks/useGoToPage";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { UserEditorTitleRow } from "../UserEditorPageShared/UserEditorTitleRow";

const listTypeNames = ["capEx", "ongoing", "singleTime"] as const;
type ListTypeName = typeof listTypeNames[number];

export const listTitles = {
  repairsListMain: "Repair Lists",
  utilitiesListMain: "Utility Lists",
  holdingCostsListMain: "Holding Cost Lists",
  capExListMain: "Capital Expense Lists",
  closingCostsListMain: "Closing Cost Lists",
  outputListMain: "Outputs Collections",
  singleTimeListMain: "Custom One-time Cost Lists",
  ongoingListMain: "Custom Ongoing Cost Lists",
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
  const goToComponents = useGoToPage("components");
  return (
    <MainSection>
      <UserEditorTitleRow
        goBack={goToComponents}
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
    </MainSection>
  );
}
