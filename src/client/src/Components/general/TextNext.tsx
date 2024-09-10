import { Box } from "@mui/material";
import { arrSx } from "../../modules/utils/mui";
import { MuiStandardProps } from "./StandardProps";

export function TextNext({ sx, ...rest }: MuiStandardProps) {
  return (
    <Box
      {...{
        sx: [
          {
            font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            display: "inline",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            border: "0px solid black",
            margin: 0,
            padding: 0,
            color: "rgb(0, 0, 0)",
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    />
  );
}
