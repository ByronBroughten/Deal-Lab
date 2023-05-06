import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../../utils/mui";
import {
  PlainIconBtn,
  PlainIconBtnProps,
} from "../../../../../general/PlainIconBtn";

interface Props extends Omit<PlainIconBtnProps, "style"> {
  isActive?: boolean;
  showAsDisabled?: boolean;
}
export function StyledActionBtn({
  showAsDisabled = false,
  isActive = false,
  sx,
  ...rest
}: Props) {
  return (
    <PlainIconBtn
      {...{
        sx: [
          {
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "transparent",
            color: nativeTheme.darkBlue.main,
            borderRadius: 5,
            paddingLeft: nativeTheme.s25,
            paddingRight: nativeTheme.s25,
            fontSize: nativeTheme.fs16,
            "&:hover": {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.darkBlue.main,
              borderColor: nativeTheme.darkBlue.main,
            },
            ...(isActive && {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.darkBlue.main,
            }),
            ...(showAsDisabled && {
              color: nativeTheme.notice.dark,
              backgroundColor: "transparent",
            }),
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    />
  );
}
