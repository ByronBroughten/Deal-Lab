import styled from "styled-components";
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { StandardSelectProps } from "../../general/StandardProps";

export default function ListMenuSelect({
  className,
  children,
  ...props
}: StandardSelectProps) {
  return (
    <FormControl>
      <InputLabel>Default Variable</InputLabel>
      <Styled
        className={"ListMenuSelect-root " + className}
        {...{ ...props, label: "Test" }}
      >
        {children}
      </Styled>
    </FormControl>
  );
}

const Styled = styled(Select)``;
