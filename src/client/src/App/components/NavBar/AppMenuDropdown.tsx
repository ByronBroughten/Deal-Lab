import React from "react";
import { FaHandshake } from "react-icons/fa";
import { HiOutlineVariable } from "react-icons/hi";
import { IoIosGitCompare } from "react-icons/io";
import { MdOutlineViewList } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { feRoutes } from "../../Constants/feRoutes";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";
import { AppMenuBtn } from "./AppMenuBtn";

interface BtnProps extends StandardBtnProps {
  $active?: boolean;
}
const iconSize = 22;

const navBtnNames = ["deal", "variables", "lists", "compare"] as const;
export type NavBtnName = typeof navBtnNames[number];

export type AppMenuProps = { activeBtnName?: NavBtnName };
export function AppMenuDropdown({ activeBtnName }: AppMenuProps) {
  const [activeName, setActiveName] = React.useState(activeBtnName);

  const navigate = useNavigate();
  const navBtns = {
    deal: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={() => navigate(feRoutes.activeDeal)}
        text={"Deal"}
        icon={<FaHandshake size={iconSize} />}
      />
    ),
    variables: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={() => navigate(feRoutes.userVariables)}
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
        onClick={() => navigate(feRoutes.components)}
        text={"Components"}
        icon={<MdOutlineViewList size={iconSize} />}
      />
    ),
    compare: (props: BtnProps) => (
      <AppMenuBtn
        {...props}
        onClick={() => navigate(feRoutes.compare)}
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
