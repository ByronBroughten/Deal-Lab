import { sxProps } from "../utils/mui";
import { reactNativeS } from "../utils/reactNative";
import { comparedDeal } from "./nativeTheme/comparedDeal";
import { inputStyles } from "./nativeTheme/inputsStyles";
import { mainSection } from "./nativeTheme/mainSection";
import { materialDraftEditor } from "./nativeTheme/materialDraftEditor";
import { subSection } from "./nativeTheme/subSection";
import { themeColors } from "./nativeTheme/themeColors";
import { themeShadows } from "./nativeTheme/themeShadows";
import { unitSizes } from "./nativeTheme/unitSizes";

const view = reactNativeS.view;
const text = reactNativeS.text;

const mediaQuery = {
  mediaPhone: 768,
} as const;

export const nativeTheme = {
  ...themeColors,
  ...themeShadows,
  ...unitSizes,
  ...mediaQuery,
  ...inputStyles,
  pageTitleFs: unitSizes.fs30,
  pageInfoDotSize: 28,
  chunkTitleFs: unitSizes.fs24,
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
    height: 70,
    activeBtn: themeColors["gray-200"],
  }),
  formSection: view({
    borderTopWidth: 1,
    borderColor: themeColors["gray-400"],
    borderStyle: "solid",
  }),
  dealMenuElement: view({
    margin: unitSizes.s3,
  }),
  disabledBtn: {
    borderColor: themeColors["gray-400"],
    color: themeColors["gray-500"],
    "&:hover": {
      background: themeColors.light,
      borderColor: themeColors["gray-400"],
      color: themeColors["gray-500"],
    },
  },
  editorMargins: {
    my: unitSizes.s4,
    mr: unitSizes.s45,
    ml: 0,
  },
  sectionTitle: sxProps({
    fontSize: unitSizes.fs24,
  }),
  mainSection,
  subSection,
  comparedDeal,
  materialDraftEditor,
} as const;
