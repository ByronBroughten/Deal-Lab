import { Box } from "@mui/material";
import React from "react";
import { arrSx } from "../../modules/utils/mui";
import { MuiStandardProps } from "./StandardProps";

export const RefColumn = React.forwardRef(
  ({ sx, ...rest }: MuiStandardProps, ref: React.ForwardedRef<any>) => (
    <Box
      {...{
        ...rest,
        ref,
        sx: [{ display: "flex", flexDirection: "column" }, ...arrSx(sx)],
      }}
    />
  )
);
