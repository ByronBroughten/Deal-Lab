import { SxProps } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { PlainIconBtn } from "../../general/PlainIconBtn";
import { IconProps, icons } from "../Icons";
import { SetInfoModalOptions, useInfoModal } from "../Modals/InfoModalProvider";

interface Props extends SetInfoModalOptions {
  iconProps?: IconProps;
  sx?: SxProps;
}
export function InfoIcon({ iconProps, sx, ...props }: Props) {
  const { setModal } = useInfoModal();
  return (
    <PlainIconBtn
      sx={sx}
      onClick={() => setModal(props)}
      middle={icons.info({
        size: 20,
        ...iconProps,
        style: {
          ...iconProps?.style,
          marginLeft: nativeTheme.s1,
          color: nativeTheme.complementary.main,
        },
      })}
    />
  );
}
