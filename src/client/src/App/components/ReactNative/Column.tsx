import { View, ViewProps } from "react-native";

export function Column({ style, ...rest }: ViewProps) {
  return (
    <View
      {...{
        style: [style, { flexDirection: "column" }],
        ...rest,
      }}
    />
  );
}
