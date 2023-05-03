import { Box, SxProps } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";

export type SectionTitleProps = {
  className?: string;
  sx?: SxProps;
  text: React.ReactNode;
};
export function SectionTitle({ className, sx, text }: SectionTitleProps) {
  return (
    <Box
      className={className}
      sx={[
        {
          fontSize: nativeTheme.fs20,
          color: nativeTheme.primary.main,
        },
        ...arrSx(sx),
      ]}
    >
      {text}
    </Box>
  );
}
