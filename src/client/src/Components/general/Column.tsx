import { Box } from "@mui/material";
import { arrSx } from "../../modules/utils/mui";
import { MuiStandardProps } from "./StandardProps";

export function Column({ sx, ...rest }: MuiStandardProps) {
  return (
    <Box
      {...{
        ...rest,
        sx: [{ display: "flex", flexDirection: "column" }, ...arrSx(sx)],
      }}
    />
  );
}
