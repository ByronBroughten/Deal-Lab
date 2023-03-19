import { nativeTheme } from "../../theme/nativeTheme";
import { PlainIconBtn, PlainIconBtnProps } from "../general/PlainIconBtn";

export function HollowBtn({ className, sx, ...rest }: PlainIconBtnProps) {
  return (
    <PlainIconBtn
      {...{
        className: `${className ?? ""}`,
        ...rest,
        sx: {
          whiteSpace: "nowrap",
          fontSize: nativeTheme.fs14,
          borderRadius: nativeTheme.muiBr0,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: nativeTheme.primary.main,
          backgroundColor: nativeTheme.light,
          color: nativeTheme.primary.main,
          "&:hover": {
            border: `solid 1px ${nativeTheme.primary.main}`,
            backgroundColor: nativeTheme.secondary.main,
            color: nativeTheme.light,
            boxShadow: "none",
          },
          ...sx,
        },
      }}
    />
  );
}
