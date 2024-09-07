import { TextField } from "@mui/material";
import styled from "styled-components";

// error (boolean), helperText (error message)
export default styled(TextField).attrs(({ className, id, ...rest }) => ({
  className: "small-form-text-field " + className,
  id,
  name: id,
  fullWidth: true,
  variant: "filled",
  size: "small",
  ...rest,
}))``;
