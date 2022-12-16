import { FaThList } from "react-icons/fa";
import { HiOutlineVariable } from "react-icons/hi";
import { ImLab } from "react-icons/im";
import { IoIosGitCompare } from "react-icons/io";
import styled from "styled-components";
import { constants } from "../../Constants";
import theme from "../../theme/Theme";
import { DomLink } from "../ActiveDeal/general/DomLink";
import { StandardProps } from "../general/StandardProps";
import { AppMenuBtn } from "./AppMenuBtn";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavAppMenu-btnDiv ${className}`}>{children}</div>;
}

export function AppMenuDropdown() {
  return (
    <Styled className="NavAppMenu-dropdown">
      <BtnDiv>
        <DomLink to={constants.feRoutes.analyzer}>
          <AppMenuBtn text={"Analyzer"} icon={<ImLab />} />
        </DomLink>
      </BtnDiv>
      <BtnDiv>
        <DomLink to={constants.feRoutes.userVariables}>
          <AppMenuBtn
            text={"Variables"}
            icon={<HiOutlineVariable className="NavAppMenu-variablesIcon" />}
          />
        </DomLink>
      </BtnDiv>
      <BtnDiv>
        <DomLink to={constants.feRoutes.userLists}>
          <AppMenuBtn text={"Lists"} icon={<FaThList />} />
        </DomLink>
      </BtnDiv>
      <BtnDiv>
        <DomLink to={constants.feRoutes.userLists}>
          <AppMenuBtn
            text={"Compare"}
            icon={<IoIosGitCompare className="AppMenuDropdown-compareArrows" />}
            className="AppMenuDropdown-compareBtn"
          />
        </DomLink>
      </BtnDiv>
    </Styled>
  );
}

const Styled = styled.div`
  .AppMenuBtn-selected {
    background-color: ${theme.primaryNext};
    color: ${theme.light};
  }
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
    :not(:last-child) {
      .ListMenuBtn-root {
        border-bottom: none;
      }
    }
  }

  .NavAppMenu-btnDiv {
    width: 100%;
  }
`;
