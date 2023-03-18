import React from "react";
import { View, ViewStyle } from "react-native";

type Props = { style?: ViewStyle; children: React.ReactNode };
export function Row({ style, ...rest }: Props) {
  return (
    <View
      {...{
        style: { ...style, flexDirection: "row" },
        ...rest,
      }}
    />
  );
}
