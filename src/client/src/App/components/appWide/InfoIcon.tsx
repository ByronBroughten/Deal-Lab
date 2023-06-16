import { SetInfoModalOptions, useInfoModal } from "../Modals/InfoModalProvider";
import { nativeTheme } from "./../../theme/nativeTheme";
import { PlainIconBtn } from "./../general/PlainIconBtn";
import { IconProps, icons } from "./../Icons";

interface Props extends SetInfoModalOptions {
  iconProps?: IconProps;
}
export function InfoIcon({ iconProps, ...props }: Props) {
  const { setModal } = useInfoModal();
  return (
    <PlainIconBtn
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
