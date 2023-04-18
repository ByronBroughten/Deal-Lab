import { sxProps } from "./../../utils/mui";
import { themeColors } from "./themeColors";
import { themeShadows } from "./themeShadows";
import { unitSizes } from "./unitSizes";

export const mainSection = sxProps({
  background: themeColors.light,
  padding: unitSizes.s4,
  borderRadius: unitSizes.br0,
  boxShadow: themeShadows.oldShadow1,
  "&:hover": {
    "& .MainSectionTitleRow-xBtn": {
      visibility: "hidden",
    },
  },
});
