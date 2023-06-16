import { nativeTheme } from "../theme/nativeTheme";
import { ConfirmationDialog } from "./Modals/ConfirmationDialogue";
import { InfoModal } from "./Modals/InfoModal";
import { InputModal } from "./Modals/InputModal";
import { useInputModal } from "./Modals/InputModalProvider";
import { VarbSelectorModal } from "./Modals/VarbSelectorModal";

export function Modals() {
  const { modalState } = useInputModal();
  return (
    <>
      <InputModal extraChildren={modalState && <OtherModals doBr={true} />} />
      {!modalState && <OtherModals doBr={false} />}
    </>
  );
}

type Props = { doBr: boolean };
function OtherModals({ doBr }: Props) {
  const options = {
    true: { modalWrapperProps: { sx: { borderRadius: nativeTheme.br0 } } },
    false: {},
  };

  const props = doBr ? options.true : options.false;

  return (
    <>
      <InfoModal {...props} />
      <VarbSelectorModal {...props} />
      <ConfirmationDialog {...props} />
    </>
  );
}
