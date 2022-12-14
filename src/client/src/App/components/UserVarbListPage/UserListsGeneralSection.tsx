import React from "react";
import styled from "styled-components";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import {
  SectionsContext,
  SectionsDispatchContext,
} from "../../sharedWithServer/stateClassHooks/useSections";
import theme, { ThemeName } from "../../theme/Theme";
import { GeneralSection } from "../appWide/GeneralSection";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { UserListMainSection } from "./UserListMainSection";
import { useSaveUserLists } from "./useSaveUserLists";

type Props = {
  themeName: ThemeName;
  storeName: FeStoreNameByType<"fullIndexWithArrStore">;
  title: string;
  makeListNode: MakeListNode;
};
export function UserListsGeneralSection({
  themeName,
  storeName,
  title,
  makeListNode,
}: Props) {
  const { saveUserLists, areSaved, userListsContext } =
    useSaveUserLists(storeName);
  const saveBtnProps = {
    ...(areSaved
      ? {
          disabled: true,
          text: "Saved",
        }
      : { disabled: false, text: "Save" }),
  };
  usePrompt(
    "You have unsaved changes. Are you sure you want to leave?",
    !areSaved
  );

  return (
    <Styled themeName={themeName} className="UserListsGeneralSection-root">
      <SectionsContext.Provider value={userListsContext}>
        <SectionsDispatchContext.Provider
          value={userListsContext.sectionsDispatch}
        >
          {/* <GeneralSectionTitle title={title} themeName={themeName}>
            <MainSectionTitleBtn
              themeName={themeName}
              className="UserListMain-saveBtn"
              onClick={saveUserLists}
              {...{
                ...saveBtnProps,
                icon: <AiOutlineSave size="25" />,
              }}
            />
          </GeneralSectionTitle> */}
          <div className="MainSection-entries">
            <UserListMainSection
              {...{
                title,
                themeName,
                storeName,
                makeListNode,
              }}
            />
          </div>
        </SectionsDispatchContext.Provider>
      </SectionsContext.Provider>
    </Styled>
  );
}

const Styled = styled(GeneralSection)`
  .UserListMainSection-root {
    padding-bottom: ${theme.s2};
  }
  .UserListMain-saveBtn {
    width: 50%;
  }
`;
