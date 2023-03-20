import { reactNativeS } from "../utils/reactNative";
import { comparedDeal } from "./nativeTheme/comparedDeal";
import { materialDraftEditor } from "./nativeTheme/materialDraftEditor";
import { subSection } from "./nativeTheme/subSection";
import { themeColors } from "./nativeTheme/themeColors";
import { unitSizes } from "./nativeTheme/unitSizes";

const view = reactNativeS.view;
const text = reactNativeS.text;

const mediaQuery = {
  mediaPhone: 768,
} as const;

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

export const nativeTheme = {
  ...themeColors,
  ...unitSizes,
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
    height: 120,
  },
  comparedDealValue: {
    height: 73,
  },
  comparedDealRoot: {
    padding: unitSizes.s35,
  },
  navBar: view({
    height: 50,
    activeBtn: themeColors["gray-200"],
  }),
  mainSection: view({
    padding: unitSizes.s4,
    backgroundColor: themeColors.light,
    borderRadius: unitSizes.br0,
    ...boxShadows.boxShadow3,
  }),
  formSection: view({
    borderTopWidth: 1,
    borderColor: themeColors["gray-400"],
    borderStyle: "solid",
  }),
  dealMenuElement: view({
    margin: unitSizes.s3,
  }),
  subSection,
  comparedDeal,
  materialDraftEditor,
} as const;
