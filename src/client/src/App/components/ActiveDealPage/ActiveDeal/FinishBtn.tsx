import { toast } from "react-toastify";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { HollowBtn } from "../../appWide/HollowBtn";
import { MuiBtnPropsNext } from "../../general/StandardProps";

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
        middle: btnText,
        onClick: styleDisabled ? () => disabledWarning(warningText) : onClick,
        sx: [
          {
            height: "50px",
            width: "100%",
            mt: nativeTheme.s3,
            fontSize: nativeTheme.fs20,
            ...(styleDisabled && nativeTheme.disabledBtn),
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
