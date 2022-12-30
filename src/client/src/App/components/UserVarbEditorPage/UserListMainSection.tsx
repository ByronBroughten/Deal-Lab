import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { SectionsContextProvider } from "../../sharedWithServer/stateClassHooks/useSections";
import theme, { ThemeName } from "../../theme/Theme";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { OuterMainSection } from "../appWide/GeneralSection/OuterMainSection";
import { InfoBlurb } from "../appWide/infoBlurb";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { SectionTitle } from "../appWide/SectionTitle";
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
};

function useSaveBtnProps({ onClick, areSaved }: UseProps): BtnProps {
  const authStatus = useAuthStatus();
  return {
    disabled: authStatus === "guest" || areSaved,
    onClick,
    text: "Save and Apply Changes",
    icon: <AiOutlineSave size="25" />,
    className: "UserListMainSection-saveBtn",
  };
}

export function UserListMainSection({ title, storeName, ...rest }: Props) {
  const { saveUserLists, areSaved, userListsContext } =
    useSaveUserLists(storeName);

  usePrompt(
    "Your changes are unapplied. Are you sure you want to leave?",
    !areSaved
  );

  const { ...btnProps } = useSaveBtnProps({
    areSaved,
    onClick: saveUserLists,
  });

  const authStatus = useAuthStatus();
  return (
    <Styled className="UserListMainSection-root">
      <SectionsContextProvider sectionsContext={userListsContext}>
        <SectionTitleRow
          className="UserListMainSection-sectionTitle"
          leftSide={
            <>
              <SectionTitle text={title} />
              <div className="UserListMainSection-btnsRow">
                <ListMenuBtn {...btnProps} />

                <ListMenuBtn
                  text="Discard Changes"
                  icon={<VscDiscard />}
                  disabled={areSaved}
                  className="UserListMainSection-discardChanges"
                />
              </div>
            </>
          }
        />
        {authStatus === "guest" && (
          <InfoBlurb className="UserListMainSection-infoBlurb">
            Log in to save and apply changes.
          </InfoBlurb>
        )}
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

const Styled = styled(OuterMainSection)`
  .UserListMainSection-infoBlurb {
    margin-top: ${theme.s3};
  }
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
