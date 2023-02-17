import { Checkbox } from "@material-ui/core";
import theme from "../../theme/Theme";

export type CheckboxStyledProps = {
  checked: boolean;
  name: string;
  onChange: () => void;
  className?: string;
};
export function CheckboxStyled(props: CheckboxStyledProps) {
  return (
    <Checkbox
      {...{
        size: "small",
        style: { color: theme.primaryNext, padding: 0 },
        ...props,
      }}
    />
  );
}
