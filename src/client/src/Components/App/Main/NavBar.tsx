import { AppBar, Box, Toolbar } from "@mui/material";
import { rem } from "polished";
import styled from "styled-components";
import logo from "../../../pictures/logo500DealLab.png";
import logoAndName from "../../../pictures/logoAndNameDealLab.png";
import { constant } from "../../../sharedWithServer/Constants";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { SaveStatusIndicator } from "../appWide/SaveStatusIndicator";
import { useGoToPage } from "../customHooks/useGoToPage";
import { useIsDevices } from "../customHooks/useMediaQueries";
import { AppMenuProps } from "./NavBar/AppMenuDropdown";
import { NavBarBtns } from "./NavBar/NavBarBtns";

interface Props extends AppMenuProps {
  showMenu?: boolean;
}

export function NavBar({ showMenu = true, ...props }: Props) {
  const goToMain = useGoToPage("mainPage");
  const { isPhone } = useIsDevices();
  const logoHeight = getLogoHeight(isPhone);
  return (
    <Styled
      sx={{
        height: nativeTheme.navBar.height,
        backgroundColor: nativeTheme.light,
        color: nativeTheme.primary.main,
        boxShadow: "none",
        zIndex: 5,
        borderBottom: theme.borderStyle,
      }}
      className="NavBar-root"
    >
      <Toolbar disableGutters={true}>
        <div className="NavBar-leftSide">
          <PlainIconBtn
            sx={{
              marginLeft: nativeTheme.s4,
              height: nativeTheme.navBar.height,
            }}
            middle={
              <Box
                sx={{ height: logoHeight }} // this is needed for the logo to not be huge
                component="img"
                src={isPhone ? logo : logoAndName}
              />
            }
            onClick={goToMain}
          />
          <SaveStatusIndicator />
        </div>
        <NavBarBtns />
      </Toolbar>
    </Styled>
  );
}

function getLogoHeight(isPhone: boolean): number {
  const appMode = constant("appMode");
  const logoHeights = {
    homeBuyer: { phone: 23, notPhone: 30 },
    investor: { phone: 30, notPhone: 40 },
  } as const;
  const heights = logoHeights[appMode];
  return isPhone ? heights.phone : heights.notPhone;
}

const Styled = styled(AppBar)`
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
    font-size: ${nativeTheme.pageTitleFs};
  }
  .NavBar-navBtnLink {
    color: inherit;
  }

  .NavBar-demoBtnIcon {
    font-size: ${rem("24px")};
  }

  .NavDropDown-navBtn {
    min-height: 69px;
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
