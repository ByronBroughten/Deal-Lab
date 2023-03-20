import { useWindowDimensions, View, ViewStyle } from "react-native";
import { nativeTheme } from "../../../theme/nativeTheme";

type OuterSectionNextProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};
export function OuterSectionNext({ children, style }: OuterSectionNextProps) {
  const dimensions = useWindowDimensions();
  const { mediaPhone, s6, s15 } = nativeTheme;
  const paddingLR = dimensions.width > mediaPhone ? s6 : s15;
  return (
    <View
      style={{
        alignItems: "center",
        overflow: "scroll",
        minHeight: dimensions.height - nativeTheme.navBar.height,
        paddingTop: nativeTheme.s4,
        paddingLeft: paddingLR,
        paddingRight: paddingLR,
        backgroundColor: nativeTheme["gray-100"],
        ...style,
      }}
    >
      {children}
    </View>
  );
}
