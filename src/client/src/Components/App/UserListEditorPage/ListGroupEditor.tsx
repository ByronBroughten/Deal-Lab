import { IdOfSectionToSaveProvider } from "../../../ContextsAndProviders/useIdOfSectionToSave";
import { StoreId } from "../../../sharedWithServer/StateGetters/Identifiers/StoreId";
import { ListChildName } from "../../../sharedWithServer/stateSchemas/sectionStores";
import { useAction } from "../../../stateHooks/useAction";
import { useGetterSectionOnlyOne } from "../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../theme/nativeTheme";
import { Row } from "../../general/Row";
import { BackBtnWrapper } from "../appWide/BackBtnWrapper";
import { VarbListOneTime } from "../appWide/ListGroup/ListGroupOneTime/VarbListOneTime";
import { ListGroupGeneric } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { SectionTitle } from "../appWide/SectionTitle";
import { ListGroupPeriodicList } from "../appWide/VarbLists/ListGroupPeriodicList";
import { VarbListCapEx } from "../appWide/VarbLists/VarbListCapEx";
import { SubSectionOpen } from "../Main/ActiveDealRoutes/ActiveDealStuff/SubSectionOpen";
import { componentProps } from "../props/userComponentPropGroups";

const listTypeNames = ["capEx", "periodic", "onetime"] as const;
type ListTypeName = (typeof listTypeNames)[number];

type ListProps = Record<ListChildName, ListTypeName>;
const listTypes: ListProps = {
  sellingListMain: "onetime",
  repairsListMain: "onetime",
  utilitiesListMain: "periodic",
  holdingCostsListMain: "periodic",
  capExListMain: "capEx",
  closingCostsListMain: "periodic",
  outputListMain: "onetime",
  onetimeListMain: "onetime",
  ongoingListMain: "periodic",
};

type Props = { listName: ListChildName };

function useListNodeMakers(
  listName: ListChildName
): Record<ListTypeName, MakeListNode> {
  return {
    onetime: (nodeProps) => (
      <IdOfSectionToSaveProvider
        storeId={StoreId.make(listName, nodeProps.feId)}
      >
        <VarbListOneTime {...{ ...nodeProps, menuType: "editorPage" }} />
      </IdOfSectionToSaveProvider>
    ),
    periodic: (nodeProps) => (
      <IdOfSectionToSaveProvider
        storeId={StoreId.make(listName, nodeProps.feId)}
      >
        <ListGroupPeriodicList {...{ ...nodeProps, menuType: "editorPage" }} />
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
