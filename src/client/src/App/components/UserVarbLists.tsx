import styled from "styled-components";
import theme from "../theme/Theme";
import { PageMain } from "./general/PageMain";
import { UserVarbListSection } from "./UserVarbLists/UserVarbListSection";

export function UserVarbLists() {
  return (
    <Styled>
      <UserVarbListSection />
    </Styled>
  );
}

const Styled = styled(PageMain)`
  background: ${theme.userVarbList.light};
`;
