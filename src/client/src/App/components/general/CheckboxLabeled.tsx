import { FormControlLabel, FormGroup } from "@mui/material";
import { CheckboxStyled, CheckboxStyledProps } from "./CheckboxStyled";

interface Props extends CheckboxStyledProps {
  label?: React.ReactNode;
}

export function CheckboxLabeled({ className, label, ...rest }: Props) {
  return (
    <FormGroup className={`CheckboxLabeled-root ${className ?? ""}`}>
      <FormControlLabel
        style={{ margin: 0 }}
        label={label}
        control={<CheckboxStyled {...rest} />}
      />
    </FormGroup>
  );
}
