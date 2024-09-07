import { Box, SxProps } from "@mui/material";
import React from "react";
import { arrSx } from "../../utils/mui";

type Props = { sx?: SxProps; className?: string; children: React.ReactNode };
export function MuiRow({ sx, className, ...rest }: Props) {
  return (
    <Box
      {...{
        className,
        sx: [
          {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    />
  );
}
