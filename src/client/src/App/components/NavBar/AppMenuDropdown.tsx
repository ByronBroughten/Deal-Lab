import React from "react";
import { FaHandshake } from "react-icons/fa";
import { HiOutlineVariable } from "react-icons/hi";
import { IoIosGitCompare } from "react-icons/io";
import { MdOutlineViewList } from "react-icons/md";
import styled from "styled-components";
import { constants } from "../../Constants";
import { Obj } from "../../sharedWithServer/utils/Obj";
import theme from "../../theme/Theme";
import { DomLink } from "../ActiveDealPage/ActiveDeal/general/DomLink";
import { StandardBtnProps } from "../general/StandardProps";
import { AppMenuBtn } from "./AppMenuBtn";

interface BtnProps extends StandardBtnProps {
  $active?: boolean;
}
const iconSize = 22;
const navBtns = {
  deal: (props: BtnProps) => (
    <DomLink to={constants.feRoutes.analyzer}>
      <AppMenuBtn
        {...props}
        text={"Deal"}
        icon={<FaHandshake size={iconSize} />}
      />
    </DomLink>
  ),
  variables: (props: BtnProps) => (
    <DomLink to={constants.feRoutes.userVariables}>
      <AppMenuBtn
        {...props}
        text={"Variables"}
        icon={
          <HiOutlineVariable
            size={iconSize}
            className="NavAppMenu-variablesIcon"
          />
        }
      />
    </DomLink>
  ),
  lists: (props: BtnProps) => (
    <DomLink to={constants.feRoutes.userLists}>
      <AppMenuBtn
        {...props}
        text={"Lists"}
        icon={<MdOutlineViewList size={iconSize} />}
      />
    </DomLink>
  ),
  compare: (props: BtnProps) => (
    <DomLink to={constants.feRoutes.compare}>
      <AppMenuBtn
        {...props}
        text={"Compare"}
        icon={
          <IoIosGitCompare
            size={iconSize}
            className="AppMenuDropdown-compareArrows"
          />
        }
        className="AppMenuDropdown-compareBtn"
      />
    </DomLink>
  ),
};

const navBtnNames = Obj.keys(navBtns);
type NavBtnName = typeof navBtnNames[number];

export type AppMenuProps = { activeBtnName?: NavBtnName };
export function AppMenuDropdown({ activeBtnName }: AppMenuProps) {
  const [activeName, setActiveName] = React.useState(activeBtnName);

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
