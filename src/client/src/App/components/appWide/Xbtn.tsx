import { Button } from "@material-ui/core";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

export function XBtn({ children, className, ...rest }: StandardBtnProps) {
  return (
    <Styled
      {...{
        className: "XBtn " + className ?? "",
        variant: "contained",
        size: "small",
        children: children || <AiOutlineClose size={15} />,
        $childrenIsDefault: !children,
        ...rest,
      }}
    />
  );
}

const Styled = styled(Button)<{ $childrenIsDefault: boolean }>`
  padding: 3px;
  color: ${theme["gray-800"]};
  background-color: transparent;
  box-shadow: none;
  border: none;
  border-radius: 100%;

  :hover {
    background-color: ${theme.error.main};
    color: ${theme.light};
  }
  white-space: nowrap;
  .MuiTouchRipple-root {
    visibility: hidden;
  }
`;
