import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { HollowBtn } from "../../appWide/HollowBtn";
import { MuiBtnPropsNext } from "../../general/StandardProps";
import { icons } from "../../Icons";

interface Props extends MuiBtnPropsNext {
  styleDisabled: boolean;
  warningText: string;
  btnText: string;
}

function disabledWarning(warningText: string) {
  toast.info(warningText);
}

export function FinishBtn({
  styleDisabled,
  onClick,
  className,
  btnText,
  warningText,
  sx,
}: Props) {
  return (
    <HollowBtn
      {...{
        className,
        left: icons.finish(),
        middle: <Box sx={{ ml: nativeTheme.s2 }}>{btnText}</Box>,
        onClick: styleDisabled ? () => disabledWarning(warningText) : onClick,
        sx: [
          {
            borderColor: nativeTheme.secondary.main,
            height: "50px",
            width: "100%",
            mt: nativeTheme.s3,
            fontSize: nativeTheme.fs22,
            ...(styleDisabled && nativeTheme.disabledBtn),
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
