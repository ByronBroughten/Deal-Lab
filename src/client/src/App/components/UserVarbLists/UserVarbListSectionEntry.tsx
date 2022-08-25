import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import MainSection from "../appWide/GeneralSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import { ListGroupLists } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { VarbListUserVarbs } from "../appWide/VarbLists/VarbListUserVarbs";

export function UserVarbListSectionEntry() {
  const feUser = useSetterSectionOnlyOne("feUser");
  return (
    <MainSection themeName="userVarbList">
      {/* Row with Save btn */}
      <MainSectionBody themeName="userVarbList">
        <ListGroupLists
          {...{
            themeName: "userVarbList",
            feIds: feUser.get.childFeIds("userVarbListMain"),
            addList: () => feUser.addChild("userVarbListMain"),
            makeListNode: (nodeProps) => <VarbListUserVarbs {...nodeProps} />,
          }}
        />
      </MainSectionBody>
    </MainSection>
  );
}
