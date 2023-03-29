import { ListChildName } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListSingleTime } from "../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SectionTitle } from "../appWide/SectionTitle";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { Row } from "../general/Row";

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

export function ListGroupEditor({ listName }: Props) {
  const title = listTitles[listName];
  const listTypeName = listTypes[listName];
  const { feInfo } = useGetterSectionOnlyOne("feStore");
  return (
    <BackBtnWrapper {...{ to: -1, label: "Back" }}>
      <SubSectionOpen>
        <Row
          style={{
            alignItems: "flex-start",
            flexWrap: "wrap",
            paddingBottom: nativeTheme.s3,
          }}
        >
          <SectionTitle sx={{ marginRight: nativeTheme.s4 }} text={title} />
        </Row>
        <div className="UserListEditor-listGroups">
          <ListGroupGeneric
            {...{
              titleText: title,
              listParentInfo: feInfo,
              listAsChildName: listName,
              makeListNode: listNodeMakers[listTypeName],
            }}
          />
        </div>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}
