import React from "react";
import { DealMode } from "../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { useIdOfSectionToSave } from "../../sharedWithServer/stateClassHooks/useIdOfSectionToSave";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { useDealModeContext } from "../customContexts/dealModeContext";

export interface InputModalOptions {
  title: React.ReactNode;
  children: React.ReactNode;
  timeSet: number;
  idOfSectionToSave?: string;
  dealMode?: DealMode<"plusMixed">;
}

type SetModalOptions = StrictOmit<InputModalOptions, "timeSet">;
type SetModalProps = SetModalOptions | null;
type SetModal = (options: SetModalProps) => void;

export type InputModalState = InputModalOptions | null;
type InputModalContextReturn = {
  modalState: InputModalState;
  setModal: SetModal;
};

const InputModalContext = React.createContext<InputModalContextReturn>({
  modalState: null,
  setModal: () => {},
});

export const useInputModal = () => React.useContext(InputModalContext);

type DealModeContextProps = StrictOmit<SetModalOptions, "dealMode"> | null;
export const useInputModalWithContext = () => {
  const idOfSectionToSave = useIdOfSectionToSave();
  const dealMode = useDealModeContext();
  const { setModal, ...rest } = useInputModal();
  return {
    ...rest,
    setModal: (props: DealModeContextProps) =>
      props === null
        ? setModal(null)
        : setModal({
            ...props,
            idOfSectionToSave,
            dealMode,
          }),
  };
};

type Props = { children: React.ReactNode };
export function InputModalProvider({ children }: Props) {
  const [modalState, setModalState] = React.useState<InputModalState>(null);

  const setModal = React.useCallback(
    (options: SetModalProps) => {
      setModalState(
        options === null
          ? options
          : {
              ...options,
              timeSet: timeS.now(),
            }
      );
    },
    [setModalState]
  );

  return (
    <InputModalContext.Provider value={{ modalState, setModal }}>
      {children}
    </InputModalContext.Provider>
  );
}
