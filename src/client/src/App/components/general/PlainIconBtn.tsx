import { Button, ButtonProps } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../theme/Theme";

export interface PlainIconBtnProps extends ButtonProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
}
export function PlainIconBtn({
  left,
  middle,
  right,
  ...rest
}: PlainIconBtnProps) {
  return (
    <Styled {...rest}>
      {left && <span className="PlainIconBtnNext-left">{left}</span>}
      {middle && <span className="PlainIconBtnNext-middle">{middle}</span>}
      {right && <span className="PlainIconBtnNext-right">{right}</span>}
    </Styled>
  );
}

const Styled = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  font-size: inherit;

  .PlainIconBtnNext-left,
  .PlainIconBtnNext-middle,
  .PlainIconBtnNext-right {
    display: flex;
    align-items: center;
  }
  .PlainIconBtnNext-left {
    margin-right: ${theme.s2};
  }
  .PlainIconBtnNext-right {
    margin-left: ${theme.s2};
  }

  padding: 0;
  border-radius: 0;
  background: transparent;
  :hover {
    background: transparent;
  }
  /* .MuiButton-label {
    visibility: hidden;
  } */
`;
