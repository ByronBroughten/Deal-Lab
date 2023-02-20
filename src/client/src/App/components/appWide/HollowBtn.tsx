import styled from "styled-components";
import theme from "../../theme/Theme";
import { PlainIconBtn, PlainIconBtnProps } from "../general/PlainIconBtn";

export function HollowBtn({ className, ...props }: PlainIconBtnProps) {
  return (
    <Styled
      {...{
        className: `HollowBtn-root ${className ?? ""}`,
        ...props,
      }}
    />
  );
}

const Styled = styled(PlainIconBtn)`
  white-space: nowrap;
  border-radius: ${theme.br0};
  box-shadow: none;
  border: solid 1px ${theme.primaryNext};
  background-color: ${theme.light};
  color: ${theme.primaryNext};
  font-size: ${theme.labelSize};

  :hover {
    background-color: ${theme.secondary};
    color: ${theme.light};
    box-shadow: none;
  }
`;
