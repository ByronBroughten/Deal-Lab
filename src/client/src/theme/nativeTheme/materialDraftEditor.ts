import React from "react";
import { sxProps } from "../../utils/mui";
import { inputStyles } from "./inputsStyles";
import { themeColors } from "./themeColors";
import { themeStandards } from "./themeStandards";
import { unitSizes } from "./unitSizes";

const fontSize = inputStyles.inputEditor.fontSize;
export const materialDraftEditor = (label?: React.ReactNode) =>
  sxProps({
    display: "inline-block",
    "& .NumObjEntityEditor-equals": {
      marginLeft: "2px",
      marginRight: "2px",
    },
    "& .NumObjEntityEditor-equalsAdornment": {
      fontSize,
    },
    "& .MaterialDraftEditor-wrapper": {
      display: "inline-block",
      borderTopLeftRadius: unitSizes.muiBr0,
      borderTopRightRadius: unitSizes.muiBr0,
      ...themeStandards.borderProps,
      borderColor: themeColors["gray-300"],
      borderBottomWidth: 0,
      backgroundColor: themeColors.light,
    },
    "& .MuiFilledInput-adornedStart": {
      pl: 0,
    },
    "& .MuiFilledInput-adornedEnd": {
      pr: 0,
    },
    "& .public-DraftEditorPlaceholder-root": {
      position: "absolute",
      whiteSpace: "nowrap",
      color: themeColors.placeholderGray,
    },
    "& .MuiInputBase-root": {
      display: "inline-block",
      whiteSpace: "nowrap",
      backgroundColor: themeColors.light,
      pt: 0,
      pb: 0,
      px: unitSizes.s2,
      borderRadius: unitSizes.muiBr0,
    },
    "& .DraftEditor-root": {
      display: "inline-block",
      fontSize,
      minWidth: 7,
      color: themeColors.dark,
    },
    "& .public-DraftEditor-content": {
      display: "inline-block",
      whiteSpace: "nowrap",
    },
    "& .public-DraftStyleDefault-block": {
      display: "flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
    },
    ...(label && {
      "& .MuiFilledInput-root": {
        px: unitSizes.s2,
        pt: "24px",
        pb: "2px",
      },
      "& .MuiFormLabel-root": {
        color: themeColors.inactiveLabel,
        whiteSpace: "nowrap",
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: themeColors.darkBlue.main,
      },
      // label location when editor is empty
      "& .MuiInputLabel-filled": {
        transform: `translate(${unitSizes.s2}, 20px) scale(1)`,
        fontSize: inputStyles.inputLabel.fontSize,
      },
      // when editor is not empty
      "& .MuiInputLabel-filled.MuiInputLabel-shrink": {
        transform: `translate(${unitSizes.s2}, 0) scale(1)`,
      },
    }),
  });
