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
      <div>
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
          labelPlacement="start"
        />
      </div>
    </Styled>
  );
}
const Styled = styled(FormGroup)`
  .MuiFormControlLabel-labelPlacementStart {
    margin: 0;
    padding: 0;
  }
  .MuiFormControlLabel-root {
    color: ${theme["gray-700"]};
    .MuiSwitch-colorPrimary {
      color: ${theme["gray-500"]};
    }
    .MuiSwitch-colorPrimary.Mui-checked {
      color: ${theme.secondary};
    }
  }
`;
