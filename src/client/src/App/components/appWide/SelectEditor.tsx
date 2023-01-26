import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../theme/Theme";
import StandardLabel from "../general/StandardLabel";
import { NumObjEntityEditor } from "../inputs/NumObjEntityEditor";

type OnChange = (
  event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
) => void;

export type SelectEditorProps = {
  value: string;
  onChange?: OnChange;
  editorVarbInfo?: FeVarbInfo;
  label?: string;
  menuItems: [string, string][];
};
export function SelectEditor({
  value,
  onChange,
  editorVarbInfo,
  label,
  menuItems,
}: SelectEditorProps) {
  return (
    <Styled>
      {label && <StandardLabel>{label}</StandardLabel>}
      <div className="SelectEditor-controlDiv">
        <FormControl
          className="SelectEditor-formControl"
          size="small"
          variant="filled"
          style={{ minWidth: "120px" }}
        >
          <Select
            className={`SelectEditor-select ${
              value === "none" ? "SelectEditor-noneSelected" : ""
            }`}
            labelId="RepairsValue-modeLabel"
            id="demo-simple-select"
            autoWidth={true}
            value={value}
            onChange={onChange}
          >
            {value === "none" && (
              <MenuItem value="none" disabled={true}>
                Choose Method
              </MenuItem>
            )}
            {menuItems.map((item) => (
              <MenuItem value={item[0]}>{item[1]}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {editorVarbInfo && (
          <NumObjEntityEditor
            {...{
              className: "SelectEditor-editor",
              feVarbInfo: editorVarbInfo,
            }}
          />
        )}
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  .SelectEditor-controlDiv {
    display: flex;
    margin-top: ${theme.s2};
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
      .editor-background {
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
