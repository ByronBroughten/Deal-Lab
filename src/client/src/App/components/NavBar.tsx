import { AppBar, Toolbar } from "@mui/material";
import { rem } from "polished";
import { BsHouse } from "react-icons/bs";
import styled from "styled-components";
import { nativeTheme } from "../theme/nativeTheme";
import theme from "../theme/Theme";
import { useGoToPage } from "./appWide/customHooks/useGoToPage";
import { SaveStatusIndicator } from "./appWide/SaveStatusIndicator";
import { AppMenuProps } from "./NavBar/AppMenuDropdown";
import { NavAppMenu } from "./NavBar/NavAppMenu";
import { NavBarBtns } from "./NavBar/NavBarBtns";
import { NavBtn } from "./NavBar/NavBtn";

interface Props extends AppMenuProps {
  showMenu?: boolean;
}
export function NavBar({ showMenu = true, ...props }: Props) {
  const goToMain = useGoToPage("mainPage");
  return (
    <Styled className="NavBar-root">
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          {showMenu ? (
            <NavAppMenu {...props} />
          ) : (
            <div className="NavBar-menuPlaceholder"></div>
          )}
          <NavBtn
            className="NavBar-brandBtn"
            icon={<BsHouse className="NavBar-brandIcon" />}
            text={<span className="NavBar-brandName">Deal Lab</span>}
            onClick={goToMain}
          />
          <SaveStatusIndicator />
        </div>
        <NavBarBtns />
      </Toolbar>
    </Styled>
  );
}

const Styled = styled(AppBar)`
  height: 50px;
  background-color: ${theme.light};
  color: ${theme.primaryNext};
  box-shadow: none;
  z-index: 5;
  border-bottom: ${theme.borderStyle};

  .NavBar-leftSide {
    display: flex;
  }

  .NavBar-menuPlaceholder {
    width: 50px;
  }

  .MuiToolbar-root {
    position: static;
  }
  div.MuiToolbar-root.MuiToolbar-regular {
    height: ${theme.navBar.height};
    min-height: ${theme.navBar.height};
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  .NavBar-brandBtn {
    font-size: ${theme.siteTitleSize};
    :hover {
      .NavBar-brandIcon {
        color: ${theme.light};
      }
    }
  }
  .NavBar-navBtnLink {
    color: inherit;
  }

  .NavBar-brandIcon {
    font-size: 27px;
    font-weight: 700;
  }
  .NavBar-brandName {
    margin-left: 4px;
    font-size: ${"22px"};
    font-weight: 500;
    .NavBar-brandNameBold {
    }
    .NavBar-brandNameRegular {
      margin-left: ${theme.s25};
    }
  }

  .NavBar-demoBtnIcon {
    font-size: ${rem("24px")};
  }

  .NavBar-signInUpBtn {
  }
  .NavBar-upgradeToProDropdown {
    .NavDropDown-navBtn {
      :hover {
        .NavBar-GetProDropdownIcon {
          color: ${nativeTheme.light};
        }
        .NavBar-ProText {
          color: ${nativeTheme.light};
        }
      }
    }
  }

  .NavBar-GetProDropdownIcon {
    margin-left: ${rem("4px")};
    font-size: ${rem("23px")};
    color: ${nativeTheme.notice.dark};
  }
`;
