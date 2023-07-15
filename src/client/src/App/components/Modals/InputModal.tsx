import React from "react";
import { DealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { IdOfSectionToSaveProvider } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { timeS } from "../../sharedWithServer/utils/timeS";
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
    ...modalState,
  };
}

type Props = { extraChildren?: React.ReactNode };
export function InputModal({ extraChildren = null }: Props) {
  const { modalState, setModal } = useInputModal();
  const { children, timeSet, title, dealMode, idOfSectionToSave } =
    getInputModalOptions(modalState);
  return (
    <ModalSection
      {...{
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
          {extraChildren}
        </IdOfSectionToSaveProvider>
      </DealModeProvider>
    </ModalSection>
  );
}
