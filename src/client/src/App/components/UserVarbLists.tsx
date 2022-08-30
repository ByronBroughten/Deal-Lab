import styled from "styled-components";
import { useAuthStatus } from "../sharedWithServer/stateClassHooks/useAuthStatus";
import theme from "../theme/Theme";
import { PageMain } from "./general/PageMain";
import { UserVarbListSection } from "./UserVarbLists/UserVarbListSection";

export function UserVarbLists() {
  const authStatus = useAuthStatus();
  return (
    <Styled>
      {authStatus === "guest" && (
        <div className="UserVarbLists-notLoggedIn">
          <div className="UserVarbLists-notLoggedInInner">
            To create and save custom variables, sign in or make an account.
          </div>
        </div>
      )}
      {authStatus !== "guest" && <UserVarbListSection />}
    </Styled>
  );
}

const Styled = styled(PageMain)`
  background: ${theme.userVarbList.light};
  .UserVarbLists-notLoggedIn {
    display: flex;
    justify-content: center;
    .UserVarbLists-notLoggedInInner {
      margin: ${theme.s3};
    }
  }
  .UserVarbLists-notLoggedInInner {
    background: ${theme.userVarbList.main};
    color: ${theme.dark};
    padding: ${theme.s3};
    border-radius: ${theme.br1};
    font-size: 18px;
    font-weight: 700;
  }
`;
