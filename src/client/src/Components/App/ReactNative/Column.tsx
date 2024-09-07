import React from "react";
import { View, ViewProps } from "react-native";

export const Column = React.forwardRef(
  ({ style, ...rest }: ViewProps, ref: React.ForwardedRef<any>) => (
    <View
      {...{
        ref,
        style: [style, { flexDirection: "column" }],
        ...rest,
      }}
    />
  )
);
