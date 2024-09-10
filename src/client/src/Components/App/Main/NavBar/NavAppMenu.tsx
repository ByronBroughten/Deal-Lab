import { AiOutlineMenu } from "react-icons/ai";
import styled from "styled-components";
import { useUserSubscription } from "../../../../modules/utilityHooks/useSubscriptions";
import { useToggle } from "../../../../modules/utilityHooks/useToggle";
import theme from "../../../../theme/Theme";
import { Sidebar } from "../../../general/SideBar";
import { AppMenuDropdown, AppMenuProps } from "./AppMenuDropdown";
import { NavDropDown } from "./NavDropDown";

export function NavAppMenu({ activeBtnName }: AppMenuProps) {
  const { userIsPro } = useUserSubscription();
  const { value: doCloseMenuToggle } = useToggle();
  return (
    <Styled
      {...{ $isFullPlan: userIsPro }}
      btnIcon={<AiOutlineMenu className="NavBar-menuIcon" />}
      dropDirection={"right"}
      doCloseViewToggle={doCloseMenuToggle}
      className="NavAppMenu-root"
    >
      <Sidebar className="NavAppMenu-Sidebar">
        <AppMenuDropdown {...{ activeBtnName }} />
      </Sidebar>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;

  @media (min-width: ${theme.mediaPhone}) {
    visibility: hidden;
  }

  .NavAppMenu-Sidebar {
    box-shadow: ${theme.boxShadow1};
  }

  .NavAppMenu-Sidebar {
    margin-top: calc(${theme.navBar.height} + 1px);
  }

  .NavBar-menuIcon {
    margin-left: ${theme.s3};
    height: 24px;
    width: 24px;
  }

  .NavAppMenu-dropdown {
    position: relative;
    z-index: 0;
  }
`;
