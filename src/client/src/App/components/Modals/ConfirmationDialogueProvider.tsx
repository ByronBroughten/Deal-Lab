import * as React from "react";
import { StrictOmit } from "../../sharedWithServer/utils/types";
import { ConfirmationOptions } from "./ConfirmationDialogue";

export interface ConfirmationModalOptions extends ConfirmationOptions {
  handleSubmit: () => void;
  handleClose: () => void;
}

export type SetConfirmationModalOptions = StrictOmit<
  ConfirmationModalOptions,
  "handleSubmit" | "handleClose"
>;
type SetConfirmationModalProps = SetConfirmationModalOptions | null;
type SetModal = (options: SetConfirmationModalProps) => Promise<void>;

export type ConfirmationModalState = ConfirmationModalOptions | null;

type ConfirmationContextReturn = {
  modalState: ConfirmationModalState;
  setModal: SetModal;
};

const ConfirmationDialogueContext =
  React.createContext<ConfirmationContextReturn>({
    modalState: null,
    setModal: Promise.reject,
  });

export const useConfirmationModal = () =>
  React.useContext(ConfirmationDialogueContext);

export const ConfirmationDialogueProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [confirmationState, setConfirmationState] =
    React.useState<ConfirmationModalState>(null);

  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const handleClose = () => {
    if (confirmationState?.catchOnCancel && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setConfirmationState(null);
  };

  const handleSubmit = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    setConfirmationState(null);
  };

  const setModal = (options: SetConfirmationModalProps) => {
    setConfirmationState(
      options === null
        ? null
        : {
            ...options,
            handleClose,
            handleSubmit,
          }
    );
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  return (
    <ConfirmationDialogueContext.Provider
      value={{ modalState: confirmationState, setModal }}
    >
      {children}
    </ConfirmationDialogueContext.Provider>
  );
};

function _Example() {
  const { setModal } = useConfirmationModal();
  const doDelete = () => console.log("deleted");
  const _example = () => {
    setModal({
      variant: "danger",
      catchOnCancel: true,
      title: "Are you sure you want to delete that?",
      description: "it can't be undone",
    })
      .then(doDelete)
      .catch();
  };
}
