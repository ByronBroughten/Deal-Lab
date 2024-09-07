import { Box, SxProps } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";

type Props = { children: React.ReactNode; sx?: SxProps };
export function TitleAppend({ children, sx }: Props) {
  return (
    <Box
      sx={[
        {
          fontSize: nativeTheme.fs18,
          color: nativeTheme.primary.main,
          // fontStyle: "italic",
        },
        ...arrSx(sx),
      ]}
    >
      {children}
    </Box>
  );
}
