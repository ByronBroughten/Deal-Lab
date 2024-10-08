import styled, { css } from "styled-components";
import theme from "../../../../theme/Theme";
import { ListMenuBtn } from "../../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

export const AppMenuBtn = styled(ListMenuBtn)<{
  $active?: boolean;
}>`
  width: 100%;
  border-radius: 0;
  border: none;

  display: flex;
  justify-content: flex-start;
  padding: ${theme.s4};
  font-size: ${theme.titleSize};
  :hover {
    background-color: ${theme["gray-200"]};
    color: ${theme.primaryNext};
  }
  ${({ $active }) =>
    $active &&
    css`
      background-color: ${theme.primaryNext};
      color: ${theme.light};
      :hover {
        background-color: ${theme.primaryNext};
        color: ${theme.light};
      }
    `}

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
