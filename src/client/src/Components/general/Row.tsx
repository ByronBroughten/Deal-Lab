import { Box } from "@mui/material";
import React from "react";
import { arrSx } from "../../modules/utils/mui";
import { MuiStandardProps } from "./StandardProps";

export function Row({ sx, ...rest }: MuiStandardProps) {
  return (
    <Box
      {...{
        sx: [
          {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    />
  );
}
