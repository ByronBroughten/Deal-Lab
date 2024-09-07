import { useMediaQuery } from "@mui/material";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";

type OuterSectionNextProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};
export function PageContent({ children, style }: OuterSectionNextProps) {
  const isTablet = useMediaQuery("(min-width:1024px)");

  const dimensions = useWindowDimensions();
  const { s6, s15 } = nativeTheme;
  const paddingLR = isTablet ? s6 : s15;
  return (
    <View
      style={{
        alignItems: "center",
        overflow: "hidden",
        minHeight: dimensions.height - nativeTheme.navBar.height,
        paddingTop: nativeTheme.s4,
        paddingBottom: nativeTheme.s4,
        paddingLeft: paddingLR,
        paddingRight: paddingLR,
        backgroundColor: nativeTheme.lightBackground,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
