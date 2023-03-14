import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { nativeTheme } from "../../theme/nativeTheme";

type Props = { style?: ViewStyle; children: React.ReactNode };

export function PageMain({ style, ...rest }: Props) {
  return (
    <View
      {...{
        style: {
          ...style,
          flex: 1,
          zIndex: 5,
          backgroundColor: nativeTheme.light,
          overflow: "visible",
        },
        ...rest,
      }}
    />
  );
}
// overflow-x: visible;

function Footer() {
  return (
    <View
      style={{
        backgroundColor: "red",
      }}
    >
      <Text>Deal Lab LLC</Text>
    </View>
  );
}
