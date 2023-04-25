import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from "@mui/material";
import React from "react";
import { FeVarbInfoNext } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { validateStateValue } from "../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { nativeTheme } from "../../theme/nativeTheme";

interface MuiSelectProps<UVN extends UnionValueName, SN extends SectionName> {
  unionValueName: UVN;
  items: [StateValue<UVN>, string][];
  value: StateValue<UVN>;
  feVarbInfo: FeVarbInfoNext<SN>;
  label?: React.ReactNode;
  sx?: SxProps;
}
export function MuiSelect<UVN extends UnionValueName, SN extends SectionName>({
  unionValueName,
  feVarbInfo,
  value,
  items,
  label,
  sx,
}: MuiSelectProps<UVN, SN>) {
  const updateValue = useAction("updateValue");
  return (
    <Box sx={sx}>
      <FormControl size={"small"} variant="filled">
        {label && (
          <InputLabel
            sx={{ fontSize: nativeTheme.fs22, color: nativeTheme.primary.main }}
          >
            {label}
          </InputLabel>
        )}
        <Select
          sx={{
            backgroundColor: nativeTheme.light,
            ...nativeTheme.subSection.borderLines,
            borderBottomWidth: 0,
          }}
          labelId="ActiveDeal-modeSelector"
          id="demo-simple-select"
          {...{
            ...(label && { label }),
            value,
            onChange: (e) => {
              updateValue({
                ...feVarbInfo,
                value: validateStateValue(e.target.value, unionValueName),
              });
            },
          }}
        >
          {items.map(([itemValue, itemLabel]) => (
            <MenuItem key={itemValue} value={itemValue}>
              {itemLabel}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
