import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as React from "react";
import { nativeTheme } from "../../theme/nativeTheme";

// Tonight, I can transform this app.
// I can implement the input info dots.
// I can finish the Fix and Flip section.

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
    <Dialog
      {...{
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
              onClick={onSubmit}
            >
              Yes
            </Button>
            <Button
              sx={{ fontSize: nativeTheme.fs22 }}
              size="large"
              color="primary"
              onClick={onClose}
              autoFocus
            >
              Cancel
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
