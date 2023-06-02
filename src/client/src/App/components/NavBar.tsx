import { AppBar, Box, Toolbar } from "@mui/material";
import { rem } from "polished";
import styled from "styled-components";
// @ts-ignore
import mainLogo from "../../icons/logo500.png";
import { nativeTheme } from "../theme/nativeTheme";
import theme from "../theme/Theme";
import { SaveStatusIndicator } from "./appWide/SaveStatusIndicator";
import { useGoToPage } from "./customHooks/useGoToPage";
import { PlainIconBtn } from "./general/PlainIconBtn";
import { AppMenuProps } from "./NavBar/AppMenuDropdown";
import { NavAppMenu } from "./NavBar/NavAppMenu";
import { NavBarBtns } from "./NavBar/NavBarBtns";

interface Props extends AppMenuProps {
  showMenu?: boolean;
}

export function NavBar({ showMenu = true, ...props }: Props) {
  const goToMain = useGoToPage("mainPage");
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
          {showMenu ? (
            <NavAppMenu {...props} />
          ) : (
            <div className="NavBar-menuPlaceholder"></div>
          )}
          <PlainIconBtn
            sx={{ height: nativeTheme.navBar.height }}
            left={
              <Box
                sx={{
                  height: 50,
                  width: 50,
                }}
                component="img"
                src={mainLogo}
              />
            }
            middle={
              <Box
                sx={{
                  fontSize: nativeTheme.chunkTitleFs,
                }}
              >
                Deal Lab
              </Box>
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
