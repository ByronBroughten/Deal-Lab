import React from "react";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import { MuiRow } from "../../../../general/MuiRow";

type Props = { children: React.ReactNode };
export function BasicInfoEditorRow({ children }: Props) {
  return (
    <MuiRow
      children={children}
      sx={{
        "& .NumObjEditor-root": {
          ...nativeTheme.editorMargins,
          "& .MuiFormControl-root.labeled": {
            minWidth: 141,
          },
        },
        "& .SelectEditor-root": {
          ...nativeTheme.editorMargins,
        },
        "& .SelectEditor-editor.NumObjEditor-root": {
          margin: 0,
        },
        "& .SelectAndItemizeEditor-root": {
          ...nativeTheme.editorMargins,
        },
        "& .SelectEditor-root.SelectAndItemizeEditor-selectEditor": {
          margin: 0,
        },
      }}
    />
  );
}
