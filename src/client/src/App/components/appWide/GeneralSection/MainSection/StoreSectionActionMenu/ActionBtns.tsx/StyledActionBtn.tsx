import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { PlainIconBtnProps } from "../../../../../general/PlainIconBtn";
import { StyledIconBtn } from "../../../../StyledIconBtn";

interface Props extends PlainIconBtnProps {
  isActive?: boolean;
  isDisabled?: boolean;
}
export function StyledActionBtn({
  style,
  isDisabled = false,
  isActive = false,
  ...rest
}: Props) {
  return (
    <StyledIconBtn
      {...{
        sx: {
          whiteSpace: "nowrap",
          fontSize: 15,
          ...(isActive && {
            color: nativeTheme.light,
            backgroundColor: nativeTheme.secondary.main,
          }),
          ...(isDisabled && {
            color: nativeTheme.notice.dark,
            backgroundColor: "transparent",
          }),
        },

        style: {
          whiteSpace: "nowrap",
          fontSize: 15,
          ...style,
        },
        ...rest,
      }}
    />
  );
}
