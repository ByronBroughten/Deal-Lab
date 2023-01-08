import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../theme/Theme";

type Props = {
  checked: boolean;
  name: string;
  label: string;
  onChange: () => void;
  className?: string;
};
export function Toggler({ label, className, ...rest }: Props) {
  return (
    <Styled className={`Toggler-root ${className ?? ""}`}>
      <FormControlLabel
        control={
          <Switch
            {...{
              ...rest,
              size: "small",
              color: "primary",
            }}
          />
        }
        label={label}
      />
    </Styled>
  );
}
const Styled = styled(FormGroup)`
  margin-left: ${theme.s25};
  .MuiFormControlLabel-root {
    margin-right: ${theme.s2};
    color: ${theme.primaryNext};

    .MuiSwitch-colorPrimary {
      color: ${theme["gray-500"]};
    }

    .MuiSwitch-colorPrimary.Mui-checked {
      color: ${theme.secondary};
    }
  }
`;
