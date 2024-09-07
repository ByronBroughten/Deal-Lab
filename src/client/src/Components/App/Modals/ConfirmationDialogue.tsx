import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SxProps,
} from "@mui/material";
import * as React from "react";
import { nativeTheme } from "../../../theme/nativeTheme";
import {
  ConfirmationModalOptions,
  ConfirmationModalState,
  useConfirmationModal,
} from "./ConfirmationDialogueProvider";

export interface ConfirmationOptions {
  catchOnCancel?: boolean;
  variant: "danger" | "info";
  title: string;
  description: string;
}

interface ConfirmationDialogProps extends ConfirmationOptions {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

function getInfoModalOptions(
  modalState: ConfirmationModalState
): ConfirmationModalOptions {
  return {
    title: "",
    description: "",
    variant: "danger",
    handleClose: () => {},
    handleSubmit: () => {},
    ...modalState,
  };
}

interface Props {
  modalWrapperProps?: { sx?: SxProps };
}

export const ConfirmationDialog: React.FC<Props> = (props) => {
  const { modalState } = useConfirmationModal();
  const { title, description, variant, handleSubmit, handleClose } =
    getInfoModalOptions(modalState);

  const open = Boolean(modalState);
  return (
    <Dialog
      {...{
        sx: {
          ...props.modalWrapperProps?.sx,
        },
        PaperProps: {
          sx: {
            borderColor: nativeTheme.notice.dark,
            borderStyle: "solid",
            borderWidth: 2,
            background: nativeTheme["gray-200"],
          },
        },
      }}
      open={open}
    >
      <DialogTitle
        sx={{ color: nativeTheme.notice.dark, fontSize: nativeTheme.fs22 }}
        id="alert-dialog-title"
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{ fontSize: nativeTheme.fs18, color: nativeTheme["gray-800"] }}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {variant === "danger" && open && (
          <>
            <Button
              sx={{ fontSize: nativeTheme.fs22 }}
              size="large"
              color="primary"
              onClick={handleSubmit}
            >
              Yes
            </Button>
            <Button
              sx={{ fontSize: nativeTheme.fs22 }}
              size="large"
              color="primary"
              onClick={handleClose}
              autoFocus
            >
              Cancel
            </Button>
          </>
        )}
        {variant === "info" && (
          <Button color="primary" onClick={handleSubmit}>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
