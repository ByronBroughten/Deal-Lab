import React from "react";
import styled from "styled-components";
import { SectionPathContext } from "../sharedWithServer/stateClassHooks/useSectionContextName";
import theme from "../theme/Theme";
import { VarbListUserVarbs } from "./appWide/VarbLists/VarbListUserVarbs";
import { NavContainer } from "./general/NavContainer";
import { UserListsPageGeneric } from "./UserListPageShared/UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

export function UserVarbListPage() {
  return (
    <NavContainer activeBtnName="variables">
      <SectionPathContext.Provider value="userVarbEditorPage">
        <Styled themeName="userVarbList" saveWhat="custom variables">
          <UserListsGeneralSection
            themeName="userVarbList"
            storeName="userVarbListMain"
            title="Variables"
            makeListNode={(nodeProps) => <VarbListUserVarbs {...nodeProps} />}
          />
        </Styled>
      </SectionPathContext.Provider>
    </NavContainer>
  );
}
const Styled = styled(UserListsPageGeneric)`
  color: ${theme.primary.main};
`;
