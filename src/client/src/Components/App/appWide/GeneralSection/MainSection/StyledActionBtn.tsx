import { nativeTheme } from "../../../../../theme/nativeTheme";
import { arrSx } from "../../../../../utils/mui";
import {
  PlainIconBtn,
  PlainIconBtnProps,
} from "../../../../general/PlainIconBtn";

interface Props extends Omit<PlainIconBtnProps, "style"> {
  isActive?: boolean;
  showAsDisabled?: boolean;
  isDangerous?: boolean;
}
export function StyledActionBtn({
  showAsDisabled = false,
  isActive = false,
  sx,
  isDangerous,
  ...rest
}: Props) {
  return (
    <PlainIconBtn
      {...{
        sx: [
          {
            height: 28,
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
            ...(isDangerous && {
              "&:hover": {
                color: nativeTheme.danger.dark,
                backgroundColor: nativeTheme["gray-300"],
                borderColor: nativeTheme.danger.dark,
              },
            }),
            ...(isActive && {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.darkBlue.main,
            }),
            ...(showAsDisabled && {
              color: nativeTheme["gray-600"],
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
