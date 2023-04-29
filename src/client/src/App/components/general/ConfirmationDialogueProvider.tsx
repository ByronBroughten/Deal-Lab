import * as React from "react";
import {
  ConfirmationDialog,
  ConfirmationOptions,
} from "./ConfirmationDialogue";

const ConfirmationDialogueContext = React.createContext<
  (options: ConfirmationOptions) => Promise<void>
>(Promise.reject);

export const useConfirmation = () =>
  React.useContext(ConfirmationDialogueContext);

export const ConfirmationDialogueProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [confirmationState, setConfirmationState] =
    React.useState<ConfirmationOptions | null>(null);

  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openConfirmation = (options: ConfirmationOptions) => {
    setConfirmationState(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

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
  return (
    <>
      <ConfirmationDialogueContext.Provider
        value={openConfirmation}
        children={children}
      />
      <ConfirmationDialog
        open={Boolean(confirmationState)}
        onSubmit={handleSubmit}
        onClose={handleClose}
        {...{
          catchOnCancel: true,
          description: "NO DESCRIPTION",
          title: "NO TITLE",
          variant: "danger",
          ...confirmationState,
        }}
      />
    </>
  );
};

function _Example() {
  const confirm = useConfirmation();
  const doDelete = () => console.log("deleted");
  const _example = () => {
    confirm({
      variant: "danger",
      catchOnCancel: true,
      title: "Are you sure you want to delete that?",
      description: "it can't be undone",
    })
      .then(doDelete)
      .catch();
  };
}
