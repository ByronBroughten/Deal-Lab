import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { ValueFixedVarbPathName } from "../../sharedWithServer/StateEntityGetters/pathNameOptions";
import theme from "../../theme/Theme";
import { MuiSelectOnChange } from "../../utils/mui";
import {
  NumEditorType,
  NumObjEntityEditor,
} from "../inputs/NumObjEntityEditor";

export type SelectEditorProps = {
  className?: string;
  selectValue: string;
  onChange?: MuiSelectOnChange;
  editorProps?: {
    feVarbInfo: FeVarbInfo;
    editorType: NumEditorType;
    quickViewVarbNames?: ValueFixedVarbPathName[];
  };
  menuItems: [string, string][];
  equalsValue?: string;
  rightOfControls?: React.ReactNode;
};
export function SelectEditor({
  className,
  selectValue,
  onChange,
  editorProps,
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
      {editorProps && (
        <NumObjEntityEditor
          {...{
            className: "SelectEditor-editor",
            labeled: false,
            ...editorProps,
          }}
        />
      )}
      {rightOfControls ?? null}
      {equalsValue && (
        <div className="SelectEditor-equalsValue">{`= ${equalsValue}`}</div>
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
  .SelectEditor-equalsValue {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: ${theme.s2};
    white-space: nowrap;
  }
  .SelectEditor-formControl {
    border: solid 1px ${theme["gray-300"]};
    border-right: none;
    border-top-left-radius: ${theme.br0};
    .MuiSelect-root {
      padding: 9px 32px 9px 12px;
    }
    .MuiInputBase-root {
      height: 35px;
      border-top-right-radius: 0;
    }
  }

  .SelectEditor-noneSelected {
    color: ${theme["gray-600"]};
  }

  .SelectEditor-editor {
    .NumObjEditor-materialDraftEditor {
      .MaterialDraftEditor-wrapper {
        border-top-left-radius: 0;
      }
      .MuiInputBase-root {
        min-width: 40px;
        border-top-left-radius: 0;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    }
  }
`;
