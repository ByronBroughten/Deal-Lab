import styled from "styled-components";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import theme, { ThemeName } from "../../theme/Theme";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import MainSectionBody from "../appWide/GeneralSection/MainSection/MainSectionBody";
import {
  ListGroupLists,
  MakeListNode,
} from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { SectionTitle } from "../appWide/SectionTitle";

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndex">;
  makeListNode: MakeListNode;
  title: string;
};
export function UserListMainSection({
  themeName,
  storeName,
  makeListNode,
  title,
}: Props) {
  const feUser = useSetterSectionOnlyOne("feUser");
  return (
    <Styled className="UserListMainSection-root">
      <SectionTitle
        {...{ text: title, className: "UserListMainSection-sectionTitle" }}
      />
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
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .SectionTitle-root {
    margin-left: ${theme.s3};
  }
`;
