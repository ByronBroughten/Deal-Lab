import { Button, ButtonProps } from "@mui/material";
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
  sx,
  ...rest
}: PlainIconBtnProps) {
  return (
    <Styled
      {...{
        sx: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "inherit",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
          padding: 0,
          borderRadius: 0,
          ...sx,
        },
        ...rest,
      }}
    >
      {left && <span className="PlainIconBtnNext-left">{left}</span>}
      {middle && <span className="PlainIconBtnNext-middle">{middle}</span>}
      {right && <span className="PlainIconBtnNext-right">{right}</span>}
    </Styled>
  );
}

const Styled = styled(Button)`
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
`;
