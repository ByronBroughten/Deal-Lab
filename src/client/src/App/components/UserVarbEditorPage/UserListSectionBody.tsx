import { StoreNameByType } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../theme/Theme";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import {
  ListGroupLists,
  MakeListNode,
} from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";

type Props = {
  themeName: ThemeName;
  storeName: StoreNameByType<"indexStore">;
  makeListNode: MakeListNode;
};
export function UserListSectionBody({
  themeName,
  storeName,
  makeListNode,
}: Props) {
  const feStore = useSetterSectionOnlyOne("feStore");
  return (
    <MainSectionBody themeName={themeName}>
      <ListGroupLists
        {...{
          themeName,
          feIds: feStore.get.childFeIds(storeName),
          addList: () => feStore.addChild(storeName),
          makeListNode,
        }}
      />
    </MainSectionBody>
  );
}
