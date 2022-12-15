import styled from "styled-components";
import theme from "../../theme/Theme";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

export const AppMenuBtn = styled(ListMenuBtn)`
  width: 100%;
  border-radius: 0;

  border: none;

  display: flex;
  justify-content: flex-start;
  padding: ${theme.s4};
  font-size: ${theme.titleSize};
  :hover,
  :focus {
    background-color: ${theme.secondary};
  }

  .MuiTouchRipple-root {
    visibility: hidden;
  }

  .ListMenuBtn-text {
    margin-left: 14px;
  }
  .ListMenuBtn-icon {
    font-size: 19px;
    display: flex;
    align-items: center;
  }
`;
