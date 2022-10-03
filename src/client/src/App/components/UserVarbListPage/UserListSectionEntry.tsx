import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../theme/Theme";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import {
  ListGroupLists,
  MakeListNode,
} from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndex">;
  makeListNode: MakeListNode;
};
export function UserListSectionEntry({
  themeName,
  storeName,
  makeListNode,
}: Props) {
  const feUser = useSetterSectionOnlyOne("feUser");
  return (
    <MainSection className="UserListSectionEntry-root">
      <MainSectionBody themeName={themeName}>
        <ListGroupLists
          {...{
            themeName,
            feIds: feUser.get.childFeIds(storeName),
            addList: () => feUser.addChild(storeName),
            makeListNode,
          }}
        />
      </MainSectionBody>
    </MainSection>
  );
}
