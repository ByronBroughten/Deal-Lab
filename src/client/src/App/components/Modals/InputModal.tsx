import React from "react";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { DealModeProvider } from "../customContexts/dealModeContext";
import {
  InputModalOptions,
  InputModalState,
  useInputModal,
} from "./InputModalProvider";
import { ModalSection } from "./ModalSection";

function getInputModalOptions(modalState: InputModalState): InputModalOptions {
  return {
    title: "",
    children: null,
    timeSet: 0,
    dealMode: "mixed",
    ...modalState,
  };
}

type Props = { extraChildren?: React.ReactNode };
export function InputModal({ extraChildren = null }: Props) {
  const { modalState, setModal } = useInputModal();
  const { children, timeSet, title, dealMode } =
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
        {children}
        {extraChildren}
      </DealModeProvider>
    </ModalSection>
  );
}
