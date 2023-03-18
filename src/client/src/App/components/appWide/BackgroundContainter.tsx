import React from "react";
import { View } from "react-native";

interface Props {
  children: React.ReactNode;
}
export function BackgroundContainer({ children }: Props) {
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 1000,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
}
