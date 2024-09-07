import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  SxProps,
} from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MuiRadioOnChange } from "../../../utils/mui";
import Radio from "../../general/Radio";
import { VarbStringLabel } from "./VarbStringLabel";

export type RadioItemProp = [string, string];

type Props = {
  value: string;
  items: RadioItemProp[];
  onChange: MuiRadioOnChange;
  sx?: SxProps;
  radioGroupSx?: SxProps;
};
export function MuiRadioSelect({
  value,
  items,
  onChange,
  sx,
  radioGroupSx,
}: Props) {
  return (
    <FormControl sx={sx}>
      <VarbStringLabel
        {...{
          sx: {
            fontSize: 20,
            color: nativeTheme.primary.main,
          },
          names: { sectionName: "deal", varbName: "dealMode" },
          id: "new-deal-select-deal-type",
        }}
      />
      <RadioGroup
        aria-labelledby={"new-deal-select-deal-type"}
        sx={radioGroupSx}
        value={value}
        onChange={onChange}
      >
        {items.map((item) => (
          <FormControlLabel
            sx={{
              marginRight: 0,
              marginLeft: 0,
              marginTop: nativeTheme.s15,
            }}
            key={item[0]}
            value={item[0]}
            label={item[1]}
            control={<Radio sx={{ marginRight: nativeTheme.s25 }} />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
