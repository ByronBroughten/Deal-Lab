import { unstable_batchedUpdates } from "react-dom";
import { nativeTheme } from "../theme/nativeTheme";
import { ConfirmationModal } from "./Modals/ConfirmationModal";
import { useConfirmationModal } from "./Modals/ConfirmationModalProvider";
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
  const confirmationModal = useConfirmationModal();
  return () => {
    unstable_batchedUpdates(() => {
      inputModal.setModal(null);
      infoModal.setModal(null);
      varbModal.setModal(null);
      confirmationModal.setModal(null);
    });
  };
}

export function Modals() {
  const { modalState } = useInputModal();
  return (
    <>
      <InputModal
        modalChildren={modalState && <ModalsSecondTier doBr={true} />}
      />
      {!modalState && <ModalsSecondTier doBr={false} />}
    </>
  );
}

function ModalsSecondTier({ doBr }: Props) {
  const { modalState } = useVarbSelectModal();
  const props = getBrProps(doBr);
  return (
    <>
      <VarbSelectorModal
        {...props}
        modalChildren={modalState && <ModalsBottom doBr={true} />}
      />
      {!modalState && <ModalsBottom doBr={doBr} />}
    </>
  );
}

function ModalsBottom({ doBr }: Props) {
  const props = getBrProps(doBr);
  return (
    <>
      <InfoModal {...props} />
      <ConfirmationModal {...props} />
    </>
  );
}

type Props = { doBr: boolean };
function getBrProps(doBr: boolean) {
  if (doBr) {
    return { modalWrapperProps: { sx: { borderRadius: nativeTheme.br0 } } };
  } else {
    return {};
  }
}
