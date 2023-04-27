import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from "@mui/material";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx, MuiSelectOnChange } from "../../utils/mui";

export interface MuiSelectStyledProps {
  className?: string;
  label?: React.ReactNode;
  value: string;
  onChange?: MuiSelectOnChange;
  items: [string, string][];
  selectProps?: { sx?: SxProps };
  sx?: SxProps;
}
export function MuiSelectStyled({
  label,
  className,
  value,
  onChange,
  items,
  selectProps = {},
  sx,
}: MuiSelectStyledProps) {
  return (
    <FormControl
      className={className}
      hiddenLabel={!label}
      sx={[
        {
          border: `solid 1px ${nativeTheme["gray-300"]}`,
          borderBottom: "none",
          borderTopLeftRadius: nativeTheme.muiBr0,
          borderTopRightRadius: nativeTheme.muiBr0,
          ...(label && {
            "& .MuiSvgIcon-root": {
              top: "16px",
            },
            "& .MuiFormLabel-root": {
              transform: `translate(12px, 2px) scale(0.75)`,
            },
          }),
          ...(!label && {
            "& .MuiInputBase-root": {
              height: "40px",
            },
            "& .MuiSelect-root": {
              padding: "10px 32px 10px 12px",
            },
          }),
        },
        ...arrSx(sx),
      ]}
      size={"small"}
      variant="filled"
    >
      {label && (
        <InputLabel
          sx={{ fontSize: nativeTheme.fs22, color: nativeTheme.primary.main }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        {...{
          value,
          onChange,
          labelId: "ActiveDeal-modeSelector",
          id: "demo-simple-select",
          ...(label && { label }),
          autoWidth: true,
          sx: [
            {
              backgroundColor: nativeTheme["gray-200"],
              borderBottomWidth: 0,
              minWidth: 0,

              ...(value === "none" && {
                color: nativeTheme["gray-600"],
              }),
            },
            ...arrSx(selectProps?.sx),
          ],
        }}
      >
        {items.map(([itemValue, itemLabel]) => (
          <MenuItem key={itemValue} value={itemValue}>
            {itemLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
