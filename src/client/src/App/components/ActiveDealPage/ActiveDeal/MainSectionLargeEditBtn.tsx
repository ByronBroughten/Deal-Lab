import { nativeTheme } from "../../../theme/nativeTheme";
import { HollowBtn } from "../../appWide/HollowBtn";
import { MuiBtnPropsNext } from "../../general/StandardProps";

export function MainSectionLargeEditBtn({ sx, ...rest }: MuiBtnPropsNext) {
  return (
    <HollowBtn
      {...{
        sx: {
          marginLeft: nativeTheme.s3,
          width: "100%",
          height: 45,
          fontSize: nativeTheme.fs16,
          ...nativeTheme.subSection.borderLines,
          ...sx,
        },
        ...rest,
      }}
    />
  );
}
