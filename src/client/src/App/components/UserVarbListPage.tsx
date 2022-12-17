import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import { VarbListUserVarbs } from "./appWide/VarbLists/VarbListUserVarbs";
import { SidebarContainer } from "./general/SidebarContainer";
import { UserListsPageGeneric } from "./UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

export function UserVarbListPage() {
  return (
    <SidebarContainer activeBtnName="variables">
      <Styled themeName="userVarbList" saveWhat="custom variables">
        <UserListsGeneralSection
          themeName="userVarbList"
          storeName="userVarbListMain"
          title="Variables"
          makeListNode={(nodeProps) => <VarbListUserVarbs {...nodeProps} />}
        />
      </Styled>
    </SidebarContainer>
  );
}
const Styled = styled(UserListsPageGeneric)`
  color: ${theme.primary.main};
`;
