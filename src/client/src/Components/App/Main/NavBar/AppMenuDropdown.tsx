import React from "react";
import { FaHandshake } from "react-icons/fa";
import { HiOutlineVariable } from "react-icons/hi";
import { IoIosGitCompare } from "react-icons/io";
import { SiWebcomponentsdotorg } from "react-icons/si";
import styled from "styled-components";
import { constants } from "../../../../sharedWithServer/Constants";
import theme from "../../../../theme/Theme";
import { StandardBtnProps } from "../../../general/StandardProps";
import { useMakeGoToPage } from "../../customHooks/useGoToPage";
import { AppMenuBtn } from "./AppMenuBtn";

interface BtnProps extends StandardBtnProps {
  $active?: boolean;
}
const iconSize = 22;

const navBtnNames = ["deal", "variables", "lists", "compare"] as const;
export type NavBtnName = (typeof navBtnNames)[number];

export type AppMenuProps = { activeBtnName?: NavBtnName };
export function AppMenuDropdown({ activeBtnName }: AppMenuProps) {
  const [activeName, setActiveName] = React.useState(activeBtnName);
  const makeGoToPage = useMakeGoToPage();
  const navBtns = {
    deal: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={makeGoToPage("activeDeal")}
        text={constants.appUnit}
        icon={<FaHandshake size={iconSize} />}
      />
    ),
    variables: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={makeGoToPage("userVariables")}
        text={"Variables"}
        icon={
          <HiOutlineVariable
            size={iconSize}
            className="NavAppMenu-variablesIcon"
          />
        }
      />
    ),
    lists: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={makeGoToPage("components")}
        text={"Components"}
        icon={<SiWebcomponentsdotorg size={iconSize} />}
      />
    ),
    compare: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={makeGoToPage("compare")}
        text={"Compare"}
        icon={
          <IoIosGitCompare
            size={iconSize}
            className="AppMenuDropdown-compareArrows"
          />
        }
        className="AppMenuDropdown-compareBtn"
      />
    ),
  };

  return (
    <Styled className="NavAppMenu-dropdown">
      {navBtnNames.map((navBtnName) => {
        return (
          <BtnDiv key={navBtnName} onClick={() => setActiveName(navBtnName)}>
            {navBtns[navBtnName]({
              $active: navBtnName === activeName,
            })}
          </BtnDiv>
        );
      })}
    </Styled>
  );
}

function BtnDiv({ children, className }: StandardBtnProps) {
  return <div className={`NavAppMenu-btnDiv ${className}`}>{children}</div>;
}

const Styled = styled.div`
  .AppMenuDropdown-compareBtn {
    .AppMenuDropdown-compareArrows {
    }
    .ListMenuBtn-text {
    }
  }

  .ListMenuBtn-root {
    height: 50px;
  }
  .ListMenuBtn-text {
    margin-left: ${theme.s3};
  }
  .MuiButton-label {
    white-space: nowrap;
  }
  .NavAppMenu-btnDiv {
    width: 100%;
    :not(:last-child) {
      .ListMenuBtn-root {
        border-bottom: none;
      }
    }
  }
`;
