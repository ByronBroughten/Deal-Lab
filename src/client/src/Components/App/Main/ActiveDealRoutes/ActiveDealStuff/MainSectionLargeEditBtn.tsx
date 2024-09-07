import { nativeTheme } from "../../../../../theme/nativeTheme";
import { MuiBtnPropsNext } from "../../../../general/StandardProps";
import { HollowBtn } from "../../../appWide/HollowBtn";

export function MainSectionLargeEditBtn({ sx, ...rest }: MuiBtnPropsNext) {
  return (
    <HollowBtn
      {...{
        sx: {
          marginLeft: nativeTheme.s3,
          width: "100%",
          height: 45,
          fontSize: nativeTheme.inputEditor.fontSize,
          ...nativeTheme.subSection.borderLines,
          ...sx,
        },
        ...rest,
      }}
    />
  );
}
