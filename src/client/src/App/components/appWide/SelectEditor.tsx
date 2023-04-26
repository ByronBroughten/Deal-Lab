import { Box, SxProps } from "@mui/material";
import React from "react";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx, MuiSelectOnChange } from "../../utils/mui";
import { MuiSelectStyled } from "./MuiSelectStyled";

type MakeEditor = (props: { sx: SxProps; labeled: boolean }) => React.ReactNode;

export type SelectEditorProps = {
  className?: string;
  label?: React.ReactNode;
  selectValue: string;
  onChange?: MuiSelectOnChange;
  makeEditor?: MakeEditor;
  menuItems: [string, string][];
  equalsValue?: string;
  rightOfControls?: React.ReactNode;
  sx?: SxProps;
};
export function SelectEditor({
  className,
  label,
  selectValue,
  onChange,
  makeEditor,
  menuItems,
  equalsValue,
  rightOfControls,
  sx,
}: SelectEditorProps) {
  return (
    <Box
      {...{
        className,
        sx: [
          {
            display: "flex",
            marginTop: nativeTheme.s2,
          },
          ...arrSx(sx),
        ],
      }}
    >
      <MuiSelectStyled
        {...{
          label,
          onChange,
          items: menuItems,
          value: selectValue,
          sx: {
            borderTopRightRadius: 0,
            borderRight: "none",
            "& .MuiInputBase-root": {
              borderTopRightRadius: 0,
            },
          },
        }}
      />
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
                ...(!label && {
                  pt: "8px",
                  pb: "8px",
                }),
                ...(label && {
                  pt: "20px",
                  pb: "4px",
                }),
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
    </Box>
  );
}
