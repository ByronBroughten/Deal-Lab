import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

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

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  variant,
  description,
  onSubmit,
  onClose,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {variant === "danger" && (
          <>
            <Button color="primary" onClick={onSubmit}>
              YES
            </Button>
            <Button color="primary" onClick={onClose} autoFocus>
              CANCEL
            </Button>
          </>
        )}
        {variant === "info" && (
          <Button color="primary" onClick={onSubmit}>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
