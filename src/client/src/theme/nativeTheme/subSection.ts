import { sxProps } from "../../modules/utils/mui";
import { themeColors } from "./themeColors";
import { unitSizes } from "./unitSizes";

const borderLines = sxProps({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: themeColors["gray-400"],
});

const border = sxProps({
  ...borderLines,
  borderRadius: unitSizes.br0,
});

export const subSection = {
  ...border,
  borderLines,
  border,
};
