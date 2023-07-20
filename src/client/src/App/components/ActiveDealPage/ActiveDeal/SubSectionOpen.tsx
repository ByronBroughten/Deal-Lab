import { SxProps } from "@mui/material";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import { MainSection } from "../../appWide/GeneralSection/MainSection";
import { useIsDevices } from "../../customHooks/useMediaQueries";

interface Props {
  children: React.ReactNode;
  sx?: SxProps;
}
export function SubSectionOpen({ children, sx }: Props) {
  const { isDesktop, isPhone } = useIsDevices();
  const { s6, s15, s3, s5, brMin, br0 } = nativeTheme;
  const sidePadding = isPhone ? s15 : s6;
  const topPadding = isPhone ? s3 : s5;
  return (
    <MainSection
      sx={[
        {
          width: "100%",
          maxWidth: 800,
          minHeight: 300,
          paddingTop: topPadding,
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
          marginBottom: nativeTheme.s6,
          ...(isPhone && { borderTopLeftRadius: brMin }),
        },
        ...arrSx(sx),
      ]}
    >
      {children}
    </MainSection>
  );
}
