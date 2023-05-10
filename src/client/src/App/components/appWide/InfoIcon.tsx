import { InfoModalOptions, useInfoModal } from "../general/InfoModalProvider";
import { nativeTheme } from "./../../theme/nativeTheme";
import { PlainIconBtn } from "./../general/PlainIconBtn";
import { IconProps, icons } from "./../Icons";

interface Props extends InfoModalOptions {
  iconProps?: IconProps;
}
export function InfoIcon({ iconProps, ...props }: Props) {
  const openInfoModal = useInfoModal();
  return (
    <PlainIconBtn
      onClick={() => openInfoModal(props)}
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
