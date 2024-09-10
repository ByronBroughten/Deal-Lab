import { sxProps } from "../../modules/utils/mui";
import { themeColors } from "./themeColors";
import { themeShadows } from "./themeShadows";
import { unitSizes } from "./unitSizes";

export const mainSection = sxProps({
  background: themeColors.light,
  padding: unitSizes.s4,
  borderRadius: unitSizes.sBr0,
  boxShadow: themeShadows.oldShadow1,
  "&:hover": {
    "& .MainSectionTitleRow-xBtn": {
      visibility: "hidden",
    },
  },
});
