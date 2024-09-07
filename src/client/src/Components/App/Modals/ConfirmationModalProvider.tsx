import React from "react";

export interface ConfirmationModalOptions {
  handleSubmit: () => void;
  title: string;
  description: string;
}

type SetModalOptions = ConfirmationModalOptions;
type SetModalProps = SetModalOptions | null;
type SetModal = (options: SetModalProps) => void;

export type ConfirmationModalState = ConfirmationModalOptions | null;
type ConfirmationModalContextReturn = {
  modalState: ConfirmationModalState;
  setModal: SetModal;
};

const InputModalContext = React.createContext<ConfirmationModalContextReturn>({
  modalState: null,
  setModal: () => {},
});

export const useConfirmationModal = () => React.useContext(InputModalContext);

type Props = { children: React.ReactNode };
export function ConfirmationModalProvider({ children }: Props) {
  const [modalState, setModalState] =
    React.useState<ConfirmationModalState>(null);

  const setModal = React.useCallback(
    (options: SetModalProps) => {
      setModalState(options);
    },
    [setModalState]
  );

  return (
    <InputModalContext.Provider value={{ modalState, setModal }}>
      {children}
    </InputModalContext.Provider>
  );
}
