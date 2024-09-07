import { nativeTheme } from "../../../theme/nativeTheme";
import { PlainIconBtnProps } from "../../general/PlainIconBtn";
import { HollowBtn } from "./HollowBtn";

export function SectionBtn({ className, sx, ...rest }: PlainIconBtnProps) {
  return (
    <HollowBtn
      className={`${className ?? ""}`}
      {...{
        ...rest,
        sx: {
          borderWidth: 1,
          borderColor: nativeTheme.subSection.borderLines.borderColor,
          ...sx,
        },
      }}
    />
  );
}
