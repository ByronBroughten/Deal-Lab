import { FormControl, InputLabel, Select } from "@mui/material";
import { StandardSelectProps } from "../../../../general/StandardProps";

export default function ListMenuSelect({
  className,
  children,
  ...props
}: StandardSelectProps) {
  return (
    <FormControl>
      <InputLabel>Default Variable</InputLabel>
      <Select
        className={"ListMenuSelect-root " + className}
        {...{ ...props, label: "Test" }}
      >
        {children}
      </Select>
    </FormControl>
  );
}
