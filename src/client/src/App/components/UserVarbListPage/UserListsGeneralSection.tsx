import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import styled from "styled-components";
import usePrompt from "../../modules/customHooks/useBlockerAndPrompt";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import {
  SectionsContext,
  SectionsDispatchContext,
} from "../../sharedWithServer/stateClassHooks/useSections";
import theme, { ThemeName } from "../../theme/Theme";
import { GeneralSection } from "../appWide/GeneralSection";
import GeneralSectionTitle from "../appWide/GeneralSection/GeneralSectionTitle";
import MainSectionTitleBtn from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionTitleBtn";
import { MakeListNode } from "../appWide/ListGroup/ListGroupShared/ListGroupGeneric/ListGroupLists";
import { UserListSectionEntry } from "./UserListSectionEntry";
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
    "Your unsaved changes will be lost when you leave. Are you sure you want to leave?",
    !areSaved
  );

  return (
    <Styled themeName={themeName} className="UserListsGeneralSection-root">
      <SectionsContext.Provider value={userListsContext}>
        <SectionsDispatchContext.Provider
          value={userListsContext.sectionsDispatch}
        >
          <GeneralSectionTitle title={title} themeName={themeName}>
            <MainSectionTitleBtn
              themeName={themeName}
              className="UserListMain-saveBtn"
              onClick={saveUserLists}
              {...{
                ...saveBtnProps,
                icon: <AiOutlineSave size="25" />,
              }}
            />
          </GeneralSectionTitle>
          <div className="MainSection-entries">
            <UserListSectionEntry
              {...{
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
  .UserListSectionEntry-root {
    padding-bottom: ${theme.s2};
  }
  .UserListMain-saveBtn {
    width: 50%;
  }
`;
