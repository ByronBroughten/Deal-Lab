import { darken, lighten } from "polished";
import React from "react";
import { ThemeProvider } from "styled-components";
import { FeInfo } from "../sharedWithServer/Analyzer/SectionMetas/Info";
import { ObjectKeys } from "../sharedWithServer/utils/Obj";

const color = {
  // blue: "#0d6efd",
  // indigo: "#6610f2",
  // purple: "#6f42c1",
  // pink: "#d63384",
  // violet: "#d333d3"
  // red: "#dc3545",
  // orange: "#fd7e14",
  // yellow: "#ffc107",
  // green: "#198754",
  // teal: "#20c997",
  // cyan: "#0dcaf0",
  white: "#fff",
  "gray-100": "#f8f9fa",
  "gray-200": "#e9ecef",
  "gray-300": "#dee2e6",
  "gray-400": "#ced4da",
  "gray-500": "#adb5bd",
  "gray-600": "#6c757d",
  "gray-700": "#495057",
  "gray-800": "#343a40",
  "gray-900": "#212529",
  black: "#000",
};

const testThemes = {
  current: {
    primary: "#2d40ad",
    secondary: "#dd001d",
    success: "#4caf50",
    warning: "#e47900",
    danger: "#f44336",
  },
  lighter: {
    primary: "#3f51b5",
    secondary: "#b11414",
    success: "#4caf50",
    warning: "#ff9800",
    danger: "#f44336",
  },
  muiDefault: {
    primary: "#3f51b5",
    secondary: "#f50057",
    success: "#4caf50",
    warning: "#ff9800",
    danger: "#f44336",
  },
};

const muiModDefault = testThemes.current;

// const muiDefault = {
//   primary: "#3f51b5",
//   secondary: "#f50057",
//   success: "#4caf50",
//   warning: "#ff9800",
//   danger: "#f44336",
// };

type SectionThemeBase = {
  light: string;
  main: string;
  dark: string;
  [key: string]: string;
};

function getStandardSection({ main, light, dark, ...rest }: SectionThemeBase) {
  return {
    main,
    light,
    dark,
    subSection: main,
    row: light,
    editor: light,
    border: dark,
    ...rest,
  };
}

export type ThemeSectionName = keyof typeof themeSections;
export type ThemeFeInfo = FeInfo & {
  sectionName: ThemeSectionName;
};
function isThemeSectionName(str: string): str is ThemeSectionName {
  return ObjectKeys(themeSections).includes(str as any);
}
export function themeSectionNameOrDefault(
  sectionName: string
): ThemeSectionName {
  return isThemeSectionName(sectionName) ? sectionName : "default";
}

const themeSections = {
  default: {
    ...getStandardSection({
      light: color["gray-200"],
      main: color["gray-400"],
      dark: color["gray-600"],
      border: color["gray-500"],
    }),
  },
  property: {
    ...getStandardSection({
      main: lighten(0.32, muiModDefault.warning),
      dark: muiModDefault.warning,
      light: lighten(0.47, muiModDefault.warning),
      get border() {
        return darken(0.07, this.main);
      },
    }),
  },
  get upfrontCostList() {
    return this.property;
  },
  loan: {
    ...getStandardSection({
      main: lighten(0.33, muiModDefault.primary),
      dark: muiModDefault.primary,
      light: lighten(0.45, muiModDefault.primary),
      get border() {
        return darken(0.1, this.main);
      },
    }),
  },
  mgmt: {
    ...getStandardSection({
      dark: muiModDefault.secondary,
      main: lighten(0.32, muiModDefault.secondary),
      light: lighten(0.47, muiModDefault.secondary),
      get border() {
        return darken(0.06, this.main);
      },
    }),
  },
  get userVarbList() {
    return this.default;
  },
  get userSingleList() {
    return this.loan;
  },
  get userOngoingList() {
    return this.mgmt;
  },
  get analysis() {
    return this.plus;
  },
  plus: {
    ...getStandardSection({
      border: darken(0.1, muiModDefault.success),
      dark: muiModDefault.success,
      main: lighten(0.15, muiModDefault.success),
      light: lighten(0.4, muiModDefault.success),
    }),
  },
  error: {
    ...getStandardSection({
      dark: darken(0.25, muiModDefault.danger),
      main: muiModDefault.danger,
      light: lighten(0.15, muiModDefault.danger),
    }),
  },
};

const theme = {
  // palette
  ...color,
  ...muiModDefault,
  ...themeSections,
  light: color["gray-100"],
  dark: color["gray-900"],
  transparentGray: color["gray-300"] + "e0",
  transparentGrayBorder: color["gray-500"] + "e0",
  placeholderGray: color["gray-600"] + "e0",

  // spacing sizes
  s0: "0.0625rem",
  s1: "0.125rem",
  s2: "0.25rem",
  s3: "0.5rem",
  s4: "1rem",

  // border radius
  br0: "0.1rem",
  br1: "0.2rem",
  brMaterialEditor: "4px",

  // field calculation template
  /* height: calc(1.5em + 0.5rem + 2px); */

  unlabeledInputHeight: "21px",
  smallToggleViewIcon: "17px",
  bigButtonHeight: "31px",

  navBar: {
    height: "40px",
    activeBtn: color["gray-200"],
  },

  // box shadow
  boxShadow1:
    "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
  boxShadow4:
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgba(0 0 0 /14%), 0px 1px 10px 0px rgba(0 0 0 / 12%)",
  boxShadow4NoTop:
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgba(0 0 0 /14%), 0px 1px 10px 0px rgba(0 0 0 / 12%)",
} as const;

export default theme;
export const Theme = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
