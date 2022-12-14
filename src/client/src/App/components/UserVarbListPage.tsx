import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import { VarbListUserVarbs } from "./appWide/VarbLists/VarbListUserVarbs";
import { UserListsPageGeneric } from "./UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

export function UserVarbListPage() {
  return (
    <Styled themeName="userVarbList" saveWhat="custom variables">
      <UserListsGeneralSection
        themeName="userVarbList"
        storeName="userVarbListMain"
        title="Variables"
        makeListNode={(nodeProps) => <VarbListUserVarbs {...nodeProps} />}
      />
    </Styled>
  );
}
const Styled = styled(UserListsPageGeneric)`
  color: ${theme.primary.main};
`;
