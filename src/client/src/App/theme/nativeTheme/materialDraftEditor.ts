import React from "react";
import { sxProps } from "../../utils/mui";
import { themeColors } from "./themeColors";
import { themeStandards } from "./themeStandards";
import { unitSizes } from "./unitSizes";

export const materialDraftEditor = (label?: React.ReactNode) =>
  sxProps({
    display: "inline-block",
    "& .MaterialDraftEditor-wrapper": {
      display: "inline-block",
      borderTopLeftRadius: unitSizes.muiBr0,
      borderTopRightRadius: unitSizes.muiBr0,
      ...themeStandards.borderProps,
      borderColor: themeColors["gray-400"],
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
      fontSize: "18px",
    },
    "& .public-DraftEditor-content": {
      display: "inline-block",
      whiteSpace: "nowrap",
      color: themeColors.dark,
    },
    "& .public-DraftStyleDefault-block": {
      display: "flex",
      flexWrap: "nowrap",
      whiteSpace: "nowrap",
    },
    ...(label && {
      "& .MuiFilledInput-root": {
        px: unitSizes.s2,
        pt: "20px",
        pb: "2px",
      },
      "& .MuiFormLabel-root": {
        color: themeColors["gray-600"],
        whiteSpace: "nowrap",
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: themeColors.primary.main,
      },
      // label location when editor is empty
      "& .MuiInputLabel-filled": {
        transform: `translate(${unitSizes.s2}, 20px) scale(1)`,
      },
      // when editor is not empty
      "& .MuiInputLabel-filled.MuiInputLabel-shrink": {
        transform: `translate(${unitSizes.s2}, 0) scale(1)`,
      },
    }),
  });
