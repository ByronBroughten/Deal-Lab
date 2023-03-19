import { darken, lighten } from "polished";
import { reactNativeS } from "../utils/reactNative";
import { basicColors } from "./nativeTheme/basicColors";
import { comparedDeal } from "./nativeTheme/comparedDeal";
import { subSection } from "./nativeTheme/subSection";
import { unitSizes } from "./nativeTheme/unitSizes";

const view = reactNativeS.view;
const text = reactNativeS.text;

const mediaQuery = {
  mediaPhone: 768,
} as const;

const themeColors = {
  primary: "#00684A",
  secondary: "#00A35C",
  notice: "#ff9868",
  danger: "#ff3527",
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
  danger: colorVariants(themeColors.danger),
};

export const nativeTheme = {
  ...basicColors,
  ...unitSizes,
  ...themeColors,
  ...themeColorVariants,
  ...boxShadows,
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
    padding: unitSizes.s3,
  },
  navBar: view({
    height: 50,
    activeBtn: basicColors["gray-200"],
  }),
  mainSection: view({
    padding: unitSizes.s4,
    backgroundColor: themeColors.light,
    borderRadius: unitSizes.br0,
    ...boxShadows.boxShadow3,
  }),
  formSection: view({
    borderTopWidth: 1,
    borderColor: basicColors["gray-400"],
    borderStyle: "solid",
  }),
  subSection,
  comparedDeal,
} as const;
