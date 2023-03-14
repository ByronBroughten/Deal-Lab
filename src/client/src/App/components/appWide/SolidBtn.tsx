import { Button } from "@mui/material";
import { CgMathPlus } from "react-icons/cg";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardBtnProps } from "../general/StandardProps";

type Props = StandardBtnProps & { smallSquare?: boolean; isOpen?: boolean };
export default function SolidBtn({
  children,
  className,
  isOpen = false,
  ...rest
}: Props) {
  const childrenIsDefault = !children;
  return (
    <Styled
      {...{
        className: "SolidBtn " + className ?? "",
        variant: "contained",
        size: "small",
        children: children || <CgMathPlus size={20} className="icon" />,
        $isOpen: isOpen,
        ...rest,
      }}
    />
  );
}

const Styled = styled(Button)<{ $isOpen: boolean }>`
  ${theme.primaryButtonColorChunk};
  border-radius: ${theme.br0};
  padding: 1px ${theme.s2} 0 ${theme.s2};
  background-color: ${theme.primaryNext};
  border: 1px solid ${theme.primaryNext};
  white-space: nowrap;
  :hover {
    ${theme.primaryButtonColorHoverChunk};
    box-shadow: none;
  }
  ${({ $isOpen }) => $isOpen && theme.primaryButtonColorHoverChunk};

  .MuiTouchRipple-root {
    visibility: hidden;
  }
`;
