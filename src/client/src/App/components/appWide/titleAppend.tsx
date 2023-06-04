import { Box, SxProps } from "@mui/material";
import { arrSx } from "../../utils/mui";
import { nativeTheme } from "./../../theme/nativeTheme";

type Props = { children: React.ReactNode; sx?: SxProps };
export function TitleAppend({ children, sx }: Props) {
  return (
    <Box
      sx={[
        {
          fontSize: nativeTheme.fs18,
          color: nativeTheme["gray-700"],
        },
        ...arrSx(sx),
      ]}
    >
      {children}
    </Box>
  );
}
