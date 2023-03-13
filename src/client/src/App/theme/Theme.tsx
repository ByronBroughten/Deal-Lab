import { darken, lighten, rem, transparentize } from "polished";
import React from "react";
import { css, ThemeProvider } from "styled-components";
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

type SectionThemeBase = {
  main: string;
  [key: string]: string;
};

function themeSection({ main, contrastText, ...rest }: SectionThemeBase) {
  return {
    main,
    contrastText: contrastText ?? themeColors.dark,
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

const v1Theme = {
  property: "#ffc99d",
  loan: "#ff7f68", //
  mgmt: "#ff9868", //
  plus: "#80c883",
  next: "#717cbb",
  danger: "#ff3527",
};

const themeColors = {
  primaryNext: "#00684A",
  primaryContrast: "#fff",
  property: color["gray-100"],
  loan: "#ff7f68",
  mgmt: "#ff9868",
  info: "#ff9868",
  get plus() {
    return this.primaryNext;
  },
  secondary: "#00A35C",
  tertiary: "#E3FCF7",
  get success() {
    return this.secondary;
  },
  successLight: "#cfffcc",

  next: "#717cbb",
  danger: "#ff3527",
  primary: "#3f51b5",
  mainBackground: "#f5f7fa",
  primaryBorder: color["gray-400"],

  light: "#fff",
  dark: "#001E2B", //color["gray-900"],
  softDark: color["gray-800"],
};

const fontSize = {
  labelSize: rem("14px"),
  infoSize: rem("16px"),
  inputSize: rem("16px"),
  smallTitleSize: rem("18px"),
  titleSize: rem("20px"),
  siteTitleSize: rem("22px"),
} as const;

const sectionSize = {
  valueSectionSize: "85px",
  inputHeight: "calc(1.5em + 0.5rem + 2px)",
};

const fonts = {
  titleChunk: css`
    font-size: ${fontSize.titleSize};
    color: ${themeColors.primaryNext};
  `,
};

const buttons = {
  primaryButtonColorChunk: css`
    color: ${themeColors.light};
    background-color: ${themeColors.primaryNext};
  `,
  primaryButtonColorHoverChunk: css`
    background-color: ${themeColors.secondary};
  `,
};

const borders = {
  get borderStyle() {
    return `solid 1px ${themeColors.primaryBorder}`;
  },
  sectionBorderChunk: css`
    border-top: solid 1px ${themeColors.primaryBorder};
    border-radius: 0;
  `,
} as const;

const mediaQuery = {
  mediaPhone: "768px",
} as const;

const themeSections = {
  default: {
    ...themeSection({
      contrastText: themeColors.dark,
      light: color["gray-200"],
      main: color["gray-500"],
      dark: color["gray-600"],
      border: color["gray-600"],
    }),
  },
  warning: {
    ...themeSection({
      contrastText: themeColors.dark,
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
  get property() {
    return this.warning;
  },
  info: {
    ...themeSection({
      contrastText: themeColors.dark,
      main: lighten(0.04, themeColors.info),
      get light() {
        return lighten(0.23, themeColors.info);
      },
      get dark() {
        return darken(0.1, themeColors.info);
      },
      get border() {
        return darken(0.2, themeColors.info);
      },
    }),
  },
  mgmt: {
    ...themeSection({
      contrastText: themeColors.dark,
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
      contrastText: themeColors.dark,
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
  get deal() {
    return this.plus;
  },
  get userOutput() {
    return this.deal;
  },
  plus: {
    ...themeSection({
      contrastText: themeColors.light,
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
  get primaryNextSet() {
    return themeSection({
      main: themeColors.primaryNext,
    });
  },

  get primary() {
    return themeSection({
      main: themeColors.primary,
      get light() {
        return lighten(0.3, this.main);
      },
      get dark() {
        return darken(0.01, this.main);
      },
      get border() {
        return darken(0.01, this.main);
      },
    });
  },
  next: themeSection({
    main: themeColors.next,
  }),
  get primaryLight() {
    return themeSection({
      get main() {
        return lighten(0.25, "#3f51b5");
      },
      get light() {
        return lighten(0.3, this.main);
      },
      get dark() {
        return darken(0.01, this.main);
      },
      get border() {
        return darken(0.01, this.main);
      },
    });
  },
  get numVarbList() {
    return this.primaryLight;
  },
  get userSingleList() {
    return this.mgmt;
  },
  get userOngoingList() {
    return this.loan;
  },
  error: {
    ...themeSection({
      dark: darken(0.25, themeColors.danger),
      main: themeColors.danger,
      light: lighten(0.15, themeColors.danger),
    }),
  },
};

const spacings = {
  s0: "0.0625rem",
  s1: "0.125rem",
  s15: "0.1875rem",
  s2: "0.25rem",
  s25: "0.375rem",
  s3: "0.5rem",
  s35: "0.75rem",
  s4: "1rem",
  s45: "1.5rem",
  s5: "2rem",
  s6: "4rem",
  s7: "8rem",
} as const;

const theme = {
  ...color,
  ...themeColors,
  ...themeSections,
  ...fontSize,
  ...sectionSize,
  ...fonts,
  ...borders,
  ...spacings,
  ...buttons,
  ...mediaQuery,
  sectionPadding: spacings.s3,
  flexElementSpacing: spacings.s2,
  dealElementSpacing: spacings.s5,

  transparentGrayDark: transparentize(0.8, color["gray-600"]),
  transparentGrayLight: transparentize(0.75, color["gray-300"]),
  transparentGray: transparentize(0.8, color["gray-400"]),
  transparentGrayBorder: transparentize(0.75, color["gray-800"]),
  placeholderGray: color["gray-600"] + "e0",

  // border radius
  br0: "5px",
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
    height: "50px",
    activeBtn: color["gray-200"],
  },

  // box shadow
  boxShadow1:
    "0px 2px 1px -2px rgb(0 0 0 / 15%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 4px 0px rgb(0 0 0 / 12%)",

  boxShadow4:
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgba(0 0 0 /14%), 0px 1px 10px 0px rgba(0 0 0 / 12%)",
  boxShadow4NoTop:
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgba(0 0 0 /14%), 0px 1px 10px 0px rgba(0 0 0 / 12%)",
} as const;

export default theme;
export const Theme = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
