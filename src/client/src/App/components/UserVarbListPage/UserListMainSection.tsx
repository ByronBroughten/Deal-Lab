import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { SectionsContextProvider } from "../../sharedWithServer/stateClassHooks/useSections";
import theme, { ThemeName } from "../../theme/Theme";
import BtnTooltip from "../appWide/BtnTooltip";
import { MainSection } from "../appWide/GeneralSection/MainSection";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { UserListSectionBody } from "./UserListSectionBody";
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
  tooltipText: string;
};
function useVariableProps({
  areSaved,
}: {
  areSaved: boolean;
}): [boolean, string, string] {
  const authStatus = useAuthStatus();
  if (authStatus === "guest")
    return [true, "Login to Save and Apply Changes", ""];
  else if (areSaved) return [true, "Save and Apply Changes", ""];
  else return [false, "Save and Apply Changes", ""];
}
function useSaveBtnProps({ onClick, ...rest }: UseProps): BtnProps {
  const props = useVariableProps(rest);
  return {
    onClick,
    disabled: props[0],
    text: props[1],
    icon: <AiOutlineSave size="25" />,
    className: "UserListMainSection-saveBtn",
    tooltipText: props[2],
  };
}

export function UserListMainSection({ title, storeName, ...rest }: Props) {
  const { saveUserLists, areSaved, userListsContext } =
    useSaveUserLists(storeName);

  usePrompt(
    "Your changes are unapplied. Are you sure you want to leave?",
    !areSaved
  );

  const { tooltipText, ...btnProps } = useSaveBtnProps({
    areSaved,
    onClick: saveUserLists,
  });
  return (
    <Styled className="UserListMainSection-root">
      <SectionsContextProvider sectionsContext={userListsContext}>
        <SectionTitleRow
          sectionTitle={title}
          className="UserListMainSection-sectionTitle"
          leftSide={
            <div className="UserListMainSection-btnsRow">
              <BtnTooltip title={tooltipText}>
                <ListMenuBtn {...btnProps} />
              </BtnTooltip>
              <ListMenuBtn
                text="Discard Changes"
                icon={<VscDiscard />}
                disabled={areSaved}
                className="UserListMainSection-discardChanges"
              />
            </div>
          }
        />
        <UserListSectionBody
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
  .UserListMainSection-btnsRow {
    display: flex;
    align-items: center;
    .ListMenuBtn-root {
      height: 33px;
      margin: 0 ${theme.s2};
    }
  }
  .UserListMainSection-discardChanges {
    width: 150px;
  }
  .UserListMainSection-saveBtn {
    width: 250px;
  }
  .SectionTitle-root {
    margin-left: ${theme.s3};
  }
`;
