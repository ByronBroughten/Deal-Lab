import { InfoModalOptions, useInfoModal } from "../general/InfoModalProvider";
import { nativeTheme } from "./../../theme/nativeTheme";
import { PlainIconBtn } from "./../general/PlainIconBtn";
import { icons } from "./../Icons";

export function InfoIcon(props: InfoModalOptions) {
  const openInfoModal = useInfoModal();
  return (
    <PlainIconBtn
      onClick={() => openInfoModal(props)}
      middle={icons.info({
        size: 20,
        style: {
          marginLeft: nativeTheme.s1,
          color: nativeTheme.complementary.main,
        },
      })}
    />
  );
}
