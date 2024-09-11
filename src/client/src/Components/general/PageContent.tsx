import { useMediaQuery } from "@mui/material";
import { useWindowHeight } from "@react-hook/window-size";
import { arrSx } from "../../modules/utils/mui";
import { nativeTheme } from "../../theme/nativeTheme";
import { Column } from "./Column";
import { MuiStandardProps } from "./StandardProps";

export function PageContent({ sx, ...rest }: MuiStandardProps) {
  const isTablet = useMediaQuery("(min-width:1024px)");
  const windowHeight = useWindowHeight();

  const { s6, s15 } = nativeTheme;
  const paddingLR = isTablet ? s6 : s15;
  return (
    <Column
      {...{
        ...rest,
        sx: [
          {
            alignItems: "center",
            overflow: "hidden",
            minHeight: windowHeight - nativeTheme.navBar.height,
            paddingTop: nativeTheme.s4,
            paddingBottom: nativeTheme.s4,
            paddingLeft: paddingLR,
            paddingRight: paddingLR,
            backgroundColor: nativeTheme.lightBackground,
          },
          ...arrSx(sx),
        ],
      }}
    />
  );
}
