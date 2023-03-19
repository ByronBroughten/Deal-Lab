import { reactNativeS } from "../../utils/reactNative";
import { basicColors } from "./basicColors";
import { unitSizes } from "./unitSizes";

const { view } = reactNativeS;

const borderLines = view({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: basicColors["gray-400"],
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
