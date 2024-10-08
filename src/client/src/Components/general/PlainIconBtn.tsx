import { Button } from "@mui/material";
import styled from "styled-components";
import { arrSx } from "../../modules/utils/mui";
import theme from "../../theme/Theme";
import { MuiBtnProps } from "./StandardProps";

export interface PlainIconBtnProps extends MuiBtnProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
  styleDisabled?: boolean;
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
        sx: [
          {
            boxShadow: "none",
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
          },
          ...arrSx(sx),
        ],
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
