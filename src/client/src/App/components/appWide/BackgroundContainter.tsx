import { Box } from "@mui/material";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";

interface Props {
  children: React.ReactNode;
}
export function BackgroundContainer({ children }: Props) {
  return (
    <Box
      sx={{
        borderTop: `1px solid ${nativeTheme["gray-400"]}`,
        paddingTop: nativeTheme.s4,
        width: "100%",
        maxWidth: 1000,
        flex: 1,
      }}
    >
      {children}
    </Box>
  );
}
