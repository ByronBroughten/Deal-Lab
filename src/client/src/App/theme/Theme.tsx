import { darken, lighten, transparentize } from "polished";
import React from "react";
import { ThemeProvider } from "styled-components";
import { Obj } from "../sharedWithServer/utils/Obj";

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
    primary: "#962d1a",
    secondary: "#b94b0c",
    warning: "#e66d0a",
    success: "#4caf50",
    danger: "#f52617",
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

type SectionThemeBase = {
  main: string;
  [key: string]: string;
};

function themeSection({ main, ...rest }: SectionThemeBase) {
  return {
    main,
    get light(): string {
      return lighten(0.25, this.main);
    },
    get dark(): string {
      return darken(0.1, this.main);
    },
    subSection: main,
    get row(): string {
      return this.light;
    },
    get editor(): string {
      return this.light;
    },
    get border(): string {
      return this.dark;
    },
    ...rest,
  };
}

export type ThemeName = keyof typeof themeSections;

function isThemeSectionName(str: string): str is ThemeName {
  return Obj.keys(themeSections).includes(str as any);
}
export function themeSectionNameOrDefault(sectionName: string): ThemeName {
  return isThemeSectionName(sectionName) ? sectionName : "default";
}

const themeColors = {
  property: "#ffc99d",
  loan: "#ff9868", // #f6a272
  mgmt: "#ff7f68", // "#e78472"
  plus: "#80c883",
  success: "#4caf50",
  next: "#717cbb",
  danger: "#ff3527",
};

// light burgundy #f17a7a

// #ad6f69
// #a27d66

const themeSections = {
  default: {
    ...themeSection({
      light: color["gray-200"],
      main: color["gray-400"],
      dark: color["gray-600"],
      border: color["gray-600"],
    }),
  },
  property: {
    ...themeSection({
      main: themeColors.property,
      get light() {
        return lighten(0.17, themeColors.property);
      },
      get dark() {
        return darken(0.1, themeColors.property);
      },
      get border() {
        return darken(0.1, themeColors.property);
      },
    }),
  },
  mgmt: {
    ...themeSection({
      main: lighten(0.04, themeColors.mgmt),
      get light() {
        return lighten(0.23, themeColors.mgmt);
      },
      get dark() {
        return darken(0.1, themeColors.mgmt);
      },
      get border() {
        return darken(0.1, themeColors.mgmt);
      },
    }),
  },
  loan: {
    ...themeSection({
      main: lighten(0.02, themeColors.loan),
      get light() {
        return lighten(0.25, themeColors.loan);
      },
      get dark() {
        return darken(0.1, themeColors.loan);
      },
      get border() {
        return darken(0.1, themeColors.loan);
      },
    }),
  },
  next: {
    ...themeSection({
      main: themeColors.next,
    }),
  },
  get deal() {
    return this.plus;
  },
  get userOutput() {
    return this.deal;
  },
  plus: {
    ...themeSection({
      main: themeColors.plus,
      get light() {
        return lighten(0.3, this.main);
      },
      get dark() {
        return darken(0.1, this.main);
      },
      get border() {
        return darken(0.1, this.main);
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
  error: {
    ...themeSection({
      dark: darken(0.25, themeColors.danger),
      main: themeColors.danger,
      light: lighten(0.15, themeColors.danger),
    }),
  },
};

const theme = {
  primary: "#3f51b5",
  ...color,
  ...themeColors,
  ...themeSections,
  light: color["gray-100"],
  dark: color["gray-900"],
  softDark: color["gray-800"],
  transparentGrayDark: transparentize(0.8, color["gray-600"]),
  transparentGrayLight: transparentize(0.75, color["gray-300"]),
  transparentGray: transparentize(0.8, color["gray-400"]),
  transparentGrayBorder: transparentize(0.75, color["gray-800"]),
  placeholderGray: color["gray-600"] + "e0",

  // spacing sizes
  s0: "0.0625rem",
  s1: "0.125rem",
  s15: "0.1875rem",
  s2: "0.25rem",
  s25: "0.375rem",
  s3: "0.5rem",
  s4: "1rem",

  // border radius
  br0: "0.1rem",
  br1: "0.2rem",
  brMaterialEditor: "4px",

  // font size
  f1: "1rem",
  f2: "1.1rem",
  f3: "1.2rem",

  // field calculation template
  /* height: calc(1.5em + 0.5rem + 2px); */

  unlabeledInputHeight: "21px",
  smallToggleViewIcon: "17px",
  bigButtonHeight: "31px",
  smallButtonHeight: "24px",

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
