import { Box } from "@mui/material";
import React from "react";
import { nativeTheme } from "../../../../../../theme/nativeTheme";

export function FirstContentCell({ children, className }: Props) {
  return (
    <Box
      className={className}
      component="td"
      sx={{ borderLeft: `1px solid ${nativeTheme.borderColor}` }}
    >
      {children}
    </Box>
  );
}

type Props = { children: React.ReactNode; className?: string };
export function FirstContentHeader({ children, className }: Props) {
  return (
    <Box
      className={className}
      component="th"
      sx={{ borderLeft: `1px solid ${nativeTheme.borderColor}` }}
    >
      {children}
    </Box>
  );
}
