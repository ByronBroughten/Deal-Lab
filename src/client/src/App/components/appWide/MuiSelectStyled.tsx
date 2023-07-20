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

export type SelectItemProp = [string, string] | null;
export interface MuiSelectStyledProps {
  id: string;
  className?: string;
  label?: React.ReactNode;
  value: string;
  onChange?: MuiSelectOnChange;
  items: SelectItemProp[];
  selectProps?: { sx?: SxProps };
  sx?: SxProps;
}
export function MuiSelectStyled({
  id,
  label,
  className,
  value,
  onChange,
  items,
  selectProps = {},
  sx,
}: MuiSelectStyledProps) {
  const displayItems = getDisplayItems(items, value);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <FormControl
      className={`MuiSelectStyled-root ${className ?? ""}`}
      hiddenLabel={!label}
      onClick={() => setIsOpen(!isOpen)}
      sx={[
        {
          border: `solid 1px ${nativeTheme["gray-300"]}`,
          borderBottom: "none",
          borderTopLeftRadius: nativeTheme.muiBr0,
          borderTopRightRadius: nativeTheme.muiBr0,
          ...(label && {
            "& .MuiInputBase-root": {
              height: "54px",
            },
            "& .MuiSvgIcon-root": {
              top: "24px",
            },
            "& .MuiFormLabel-root": {
              fontSize: nativeTheme.inputLabel.fontSize,
              transform: `translate(12px, 0px) scale(1)`,
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
          htmlFor={id}
          sx={{ fontSize: nativeTheme.fs22, color: nativeTheme.inactiveLabel }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        {...{
          id,
          name: id,
          value,
          onChange,
          MenuProps: {
            // disablePortal: true,
          },
          labelId: "ActiveDeal-modeSelector",
          ...(label && { label }),
          autoWidth: true,
          sx: [
            {
              fontSize: nativeTheme.inputEditor.fontSize,
              backgroundColor: nativeTheme["gray-150"],
              borderBottomWidth: 0,
              minWidth: 0,
            },
            ...arrSx(selectProps?.sx),
          ],
        }}
      >
        {displayItems.map(([itemValue, itemLabel]) => (
          <MenuItem
            sx={{
              ...(itemLabel === "Choose method" && {
                color: nativeTheme["gray-600"],
              }),
            }}
            key={itemValue}
            value={itemValue}
          >
            {itemLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function getDisplayItems(
  itemProps: SelectItemProp[],
  selectedValue: string
): [string, string][] {
  return itemProps.filter((item) => {
    if (item === null) return false;
    const [itemValue, itemLabel] = item;
    if (itemLabel === "Choose method" && itemValue !== selectedValue) {
      return false;
    }
    return true;
  }) as [string, string][];
}
