import styled from "styled-components";
import { TextField } from "@material-ui/core";

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
