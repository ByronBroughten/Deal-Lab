import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../utils/mui";
import { MuiBtnPropsNext } from "../../../../general/StandardProps";
import { HollowBtn } from "../../../appWide/HollowBtn";
import { icons } from "../../../Icons";

interface Props extends MuiBtnPropsNext {
  styleDisabled?: boolean;
  warningText?: string;
  btnText?: React.ReactNode;
  btnIcon?: React.ReactNode;
}

function disabledWarning(warningText: string) {
  toast.info(warningText);
}

export function FinishBtn({
  styleDisabled,
  onClick,
  className,
  btnText = "Finish",
  btnIcon = icons.finish(),
  warningText,
  sx,
}: Props) {
  return (
    <HollowBtn
      {...{
        className,
        left: btnIcon,
        middle: <Box sx={{ ml: nativeTheme.s2 }}>{btnText}</Box>,
        onClick:
          styleDisabled && warningText
            ? () => disabledWarning(warningText)
            : onClick,
        sx: [
          {
            border: `1px solid ${nativeTheme["gray-300"]}`,
            boxShadow: nativeTheme.oldShadow1,
            borderRadius: nativeTheme.br0,
            height: "50px",
            width: "100%",
            fontSize: nativeTheme.fs22,
            ...(styleDisabled && nativeTheme.disabledBtn),
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
