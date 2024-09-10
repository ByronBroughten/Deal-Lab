import { Box, SxProps } from "@mui/material";
import { BsCircle } from "react-icons/bs";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { arrSx } from "../../../modules/utils/mui";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";

type Props = { checked?: boolean; sx?: SxProps; className?: string };
export function CheckMarkCircle({ checked = false, sx, className }: Props) {
  return (
    <Box
      className={className}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          position: "relative",
          marginRight: nativeTheme.s25,
        },
        ...arrSx(sx),
      ]}
    >
      <BsCircle size={21} color={theme.primaryNext} />
      {checked && (
        <Box
          sx={{
            position: "absolute",
            top: 1,
            left: 1,
          }}
        >
          <IoMdCheckmarkCircle size={19} color={theme.secondary} />
        </Box>
      )}
    </Box>
  );
}
