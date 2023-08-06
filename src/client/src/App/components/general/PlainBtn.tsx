import { Button } from "@mui/material";
import { arrSx } from "../../utils/mui";

type Props = any;
export function PlainBtn({ children, sx, ...rest }: Props) {
  return (
    <Button
      {...{
        sx: [
          {
            background: "none",
            border: "none",
            borderRadius: 0,
            "&:hover": { background: "none" },
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    >
      {children}
    </Button>
  );
}
