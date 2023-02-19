import React from "react";
import { View, ViewProps } from "react-native";

interface Props {
  RelativeProps?: ViewProps;
  AbsoluteProps?: ViewProps;
  children: React.ReactNode;
}
export function DropdownContainer({
  RelativeProps,
  AbsoluteProps,
  children,
}: Props) {
  return (
    <View
      {...{
        ...RelativeProps,
        style: [RelativeProps?.style, { position: "relative" }],
      }}
    >
      <View
        {...{
          ...AbsoluteProps,
          style: [AbsoluteProps?.style, { position: "absolute" }],
        }}
      >
        {children}
      </View>
    </View>
  );
}
