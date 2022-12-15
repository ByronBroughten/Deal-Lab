import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { SectionsContextProvider } from "../../sharedWithServer/stateClassHooks/useSections";
import theme, { ThemeName } from "../../theme/Theme";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { UserListsSectionBody } from "./UserListGroupLists";
import { useSaveUserLists } from "./useSaveUserLists";

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndexWithArrStore">;
  makeListNode: MakeListNode;
  title: string;
};

type UseProps = { areSaved: boolean; onClick: () => void };
type BtnProps = {
  text: string;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  className: string;
};
function useSaveBtnProps({ areSaved, onClick }: UseProps): BtnProps {
  const props = (
    areSaved ? [true, "Saved"] : [false, "Save and Apply Changes"]
  ) as [boolean, string];

  return {
    onClick,
    disabled: props[0],
    text: props[1],
    icon: <AiOutlineSave size="25" />,
    className: "UserListMainSection-saveBtn",
  };
}

export function UserListMainSection({ title, storeName, ...rest }: Props) {
  const { saveUserLists, areSaved, userListsContext } =
    useSaveUserLists(storeName);

  usePrompt(
    "You have unsaved changes. Are you sure you want to leave?",
    !areSaved
  );

  const btnProps = useSaveBtnProps({ areSaved, onClick: saveUserLists });
  return (
    <Styled className="UserListMainSection-root">
      <SectionsContextProvider sectionsContext={userListsContext}>
        <SectionTitleRow
          sectionTitle={title}
          className="UserListMainSection-sectionTitle"
          leftSide={<ListMenuBtn {...btnProps} />}
        />
        <UserListsSectionBody
          {...{
            storeName,
            ...rest,
          }}
        />
      </SectionsContextProvider>
    </Styled>
  );
}

const Styled = styled(MainSection)`
  .UserListMainSection-saveBtn {
    width: 200px;
  }
  .SectionTitle-root {
    margin-left: ${theme.s3};
  }
`;
