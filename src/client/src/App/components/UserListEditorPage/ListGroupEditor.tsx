import { ListChildName } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { StoreId } from "../../sharedWithServer/StateGetters/StoreId";
import { nativeTheme } from "../../theme/nativeTheme";
import { SubSectionOpen } from "../ActiveDealPage/ActiveDeal/SubSectionOpen";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { VarbListOneTime } from "../appWide/ListGroup/ListGroupOneTime/VarbListOneTime";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { SectionTitle } from "../appWide/SectionTitle";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { VarbListOngoing } from "../appWide/VarbLists/VarbListOngoing";
import { Row } from "../general/Row";
import { componentProps } from "../props/userComponentPropGroups";

const listTypeNames = ["capEx", "ongoing", "singleTime"] as const;
type ListTypeName = (typeof listTypeNames)[number];

type ListProps = Record<ListChildName, ListTypeName>;
const listTypes: ListProps = {
  sellingListMain: "singleTime",
  repairsListMain: "singleTime",
  utilitiesListMain: "ongoing",
  holdingCostsListMain: "ongoing",
  capExListMain: "capEx",
  closingCostsListMain: "ongoing",
  outputListMain: "singleTime",
  onetimeListMain: "singleTime",
  ongoingListMain: "ongoing",
};

type Props = { listName: ListChildName };

function useListNodeMakers(
  listName: ListChildName
): Record<ListTypeName, MakeListNode> {
  return {
    singleTime: (nodeProps) => (
      <IdOfSectionToSaveProvider
        storeId={StoreId.make(listName, nodeProps.feId)}
      >
        <VarbListOneTime {...{ ...nodeProps, menuType: "editorPage" }} />
      </IdOfSectionToSaveProvider>
    ),
    ongoing: (nodeProps) => (
      <IdOfSectionToSaveProvider
        storeId={StoreId.make(listName, nodeProps.feId)}
      >
        <VarbListOngoing {...{ ...nodeProps, menuType: "editorPage" }} />
      </IdOfSectionToSaveProvider>
    ),
    capEx: (nodeProps) => (
      <IdOfSectionToSaveProvider
        storeId={StoreId.make(listName, nodeProps.feId)}
      >
        <VarbListCapEx
          {...{
            ...nodeProps,
            menuType: "editorPage",
          }}
        />
      </IdOfSectionToSaveProvider>
    ),
  };
}

export function ListGroupEditor({ listName }: Props) {
  const listTypeName = listTypes[listName];
  const feStore = useGetterSectionOnlyOne("feStore");
  const addToStore = useAction("addToStore");
  const nodeMakers = useListNodeMakers(listName);

  const { title } = componentProps[listName];
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
              listFeIds: feStore.childFeIds(listName),
              makeListNode: nodeMakers[listTypeName],
              addList: () => addToStore({ storeName: listName }),
            }}
          />
        </div>
      </SubSectionOpen>
    </BackBtnWrapper>
  );
}
