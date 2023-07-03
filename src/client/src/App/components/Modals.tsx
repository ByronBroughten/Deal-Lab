import { unstable_batchedUpdates } from "react-dom";
import { nativeTheme } from "../theme/nativeTheme";
import { ConfirmationDialog } from "./Modals/ConfirmationDialogue";
import { useConfirmationModal } from "./Modals/ConfirmationDialogueProvider";
import { InfoModal } from "./Modals/InfoModal";
import { useInfoModal } from "./Modals/InfoModalProvider";
import { InputModal } from "./Modals/InputModal";
import { useInputModal } from "./Modals/InputModalProvider";
import { useVarbSelectModal } from "./Modals/VarbSelectModalProvider";
import { VarbSelectorModal } from "./Modals/VarbSelectorModal";

export function useCloseAllModals() {
  const inputModal = useInputModal();
  const infoModal = useInfoModal();
  const varbModal = useVarbSelectModal();
  const confirm = useConfirmationModal();
  return () => {
    unstable_batchedUpdates(() => {
      inputModal.setModal(null);
      infoModal.setModal(null);
      varbModal.setModal(null);
      confirm.setModal(null);
    });
  };
}

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
