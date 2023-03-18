import { darken, lighten } from "polished";
import { reactNativeS } from "../utils/reactNative";

const view = reactNativeS.view;
const text = reactNativeS.text;

const basicColors = {
  blue: "#0d6efd",
  indigo: "#6610f2",
  purple: "#6f42c1",
  pink: "#d63384",
  violet: "#d333d3",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#198754",
  teal: "#20c997",
  cyan: "#0dcaf0",
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
} as const;

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

const fontSizes = {
  fs14: 14,
  fs16: 16,
  fs18: 18,
  fs20: 20,
  fs22: 22,
  fs24: 24,
  fs26: 26,
};

const mediaQuery = {
  mediaPhone: 768,
} as const;

const themeColors = {
  primary: "#00684A",
  secondary: "#00A35C",
  notice: "#ff9868",
  complementary: "#3f51b5",
  dark: "#001E2B",
  light: "#fff",
} as const;

type ColorVariantOptions = {
  light?: string;
  dark?: string;
  contrast?: string;
};
type ColorVariants = {
  main: string;
  light: string;
  dark: string;
  contrast: string;
};
function colorVariants(
  main: string,
  { contrast, ...rest }: ColorVariantOptions = {}
): ColorVariants {
  return {
    main,
    get light(): string {
      return lighten(0.25, this.main);
    },
    get dark(): string {
      return darken(0.1, this.main);
    },
    contrast: contrast ?? themeColors.dark,
    ...rest,
  };
}

const boxShadows = {
  boxShadow1: view({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }),
  boxShadow2: view({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }),
  boxShadow3: view({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  }),
};

const themeColorVariants = {
  primary: colorVariants(themeColors.primary),
  secondary: colorVariants(themeColors.secondary),
  notice: colorVariants(themeColors.notice),
  complementary: colorVariants(themeColors.complementary),
};

const borderRadiuses = {
  br0: 5,
} as const;

const muiBr = {
  muiBr0: "5px",
} as const;

export const nativeTheme = {
  ...basicColors,
  ...borderRadiuses,
  ...muiBr,
  ...spacings,
  ...themeColors,
  ...themeColorVariants,
  ...boxShadows,
  ...fontSizes,
  ...mediaQuery,
  standardBorder(borderColor: string) {
    return view({
      borderStyle: "solid",
      borderWidth: 1,
      borderColor,
    });
  },
  sideBar: {
    width: "150px",
  },
  comparedDealHead: {
    height: 80,
  },
  comparedDealValue: {
    height: 73,
  },
  comparedDealRoot: {
    padding: spacings.s3,
  },
  navBar: view({
    height: 50,
    activeBtn: basicColors["gray-200"],
  }),
  mainSection: view({
    padding: spacings.s4,
    backgroundColor: themeColors.light,
    borderRadius: borderRadiuses.br0,
    ...boxShadows.boxShadow3,
  }),
  formSection: view({
    borderTopWidth: 1,
    borderColor: basicColors["gray-400"],
    borderStyle: "solid",
  }),
  subSection: {
    borderLines: view({
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: basicColors["gray-400"],
    }),
  },
} as const;
