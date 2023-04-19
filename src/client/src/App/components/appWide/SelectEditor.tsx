import { Box, FormControl, MenuItem, Select, SxProps } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { MuiSelectOnChange } from "../../utils/mui";

type MakeEditor = (props: { sx: SxProps; labeled: boolean }) => React.ReactNode;

export type SelectEditorProps = {
  className?: string;
  selectValue: string;
  onChange?: MuiSelectOnChange;
  makeEditor?: MakeEditor;
  menuItems: [string, string][];
  equalsValue?: string;
  rightOfControls?: React.ReactNode;
};
export function SelectEditor({
  className,
  selectValue,
  onChange,
  makeEditor,
  menuItems,
  equalsValue,
  rightOfControls,
}: SelectEditorProps) {
  return (
    <Styled className={`SelectEditor-controlDiv ${className ?? ""}`}>
      <FormControl
        className="SelectEditor-formControl"
        size="small"
        variant="filled"
        style={{ minWidth: "120px" }}
        hiddenLabel
      >
        <Select
          className={`SelectEditor-select ${
            selectValue === "none" ? "SelectEditor-noneSelected" : ""
          }`}
          labelId="RepairsValue-modeLabel"
          id="demo-simple-select"
          autoWidth={true}
          value={selectValue}
          onChange={onChange}
        >
          {selectValue === "none" && (
            <MenuItem value="none" disabled={true}>
              Choose Method
            </MenuItem>
          )}
          {menuItems.map((item) => (
            <MenuItem key={item[0]} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {makeEditor &&
        makeEditor({
          labeled: false,
          sx: {
            "& .NumObjEditor-materialDraftEditor": {
              "& .MaterialDraftEditor-wrapper": {
                borderTopLeftRadius: 0,
                borderLeftWidth: 0,
              },
              "& .MuiInputBase-root": {
                minWidth: 50,
                borderTopLeftRadius: 0,
                pt: "8px",
                pb: "7px",
              },
            },
          },
        })}
      {rightOfControls ?? null}
      {equalsValue && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            fontSize: "18px",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            alignItems: "center",
            ml: nativeTheme.s2,
          }}
        >{`= ${equalsValue}`}</Box>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  margin-top: ${theme.s2};
  .SelectEditor-select {
    min-width: 0px;
  }
  .SelectEditor-formControl {
    border: solid 1px ${theme["gray-300"]};
    border-right: none;
    border-bottom: none;
    border-top-left-radius: ${theme.br0};
    .MuiSelect-root {
      padding: 10px 32px 10px 12px;
    }
    .MuiInputBase-root {
      height: 40px;
      border-top-right-radius: 0;
    }
  }

  .SelectEditor-noneSelected {
    color: ${theme["gray-600"]};
  }
`;
