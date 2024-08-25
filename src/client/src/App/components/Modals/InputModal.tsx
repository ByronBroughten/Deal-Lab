import React from "react";
import { DealMode } from "../../../sharedWithServer/stateSchemas/StateValue/dealMode";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { IdOfSectionToSaveProvider } from "../../stateClassHooks/useIdOfSectionToSave";
import { nativeTheme } from "../../theme/nativeTheme";
import { DealModeProvider } from "../customContexts/dealModeContext";
import {
  InputModalOptions,
  InputModalState,
  useInputModal,
} from "./InputModalProvider";
import { ModalSection } from "./ModalSection";

function getInputModalOptions(
  modalState: InputModalState
): InputModalOptions & {
  dealMode: DealMode<"plusMixed">;
  idOfSectionToSave: string;
} {
  return {
    title: "",
    children: null,
    timeSet: 0,
    idOfSectionToSave: "",
    dealMode: "mixed",
    showFinish: false,
    ...modalState,
  };
}

type Props = { modalChildren?: React.ReactNode };
export function InputModal({ modalChildren = null }: Props) {
  const { modalState, setModal } = useInputModal();
  const { children, timeSet, title, dealMode, idOfSectionToSave, showFinish } =
    getInputModalOptions(modalState);
  return (
    <ModalSection
      {...{
        modalSectionProps: {
          sx: {
            padding: nativeTheme.s4,
            borderRadius: nativeTheme.br0,
          },
        },
        showFinish,
        title,
        show: Boolean(modalState),
        closeModal: () => {
          if (timeSet && timeSet < timeS.now() - 200) {
            setModal(null);
          }
        },
      }}
    >
      <DealModeProvider {...{ dealMode }}>
        <IdOfSectionToSaveProvider {...{ storeId: idOfSectionToSave }}>
          {children}
          {modalChildren}
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </ModalSection>
  );
}
