import { reactNativeS } from "../../modules/utils/reactNative";
import { themeColors } from "./themeColors";
import { unitSizes } from "./unitSizes";

const { view } = reactNativeS;

const borderLines = view({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: themeColors["gray-400"],
});

const border = view({
  ...borderLines,
  borderRadius: unitSizes.br0,
});

export const subSection = {
  ...border,
  borderLines,
  border,
};
