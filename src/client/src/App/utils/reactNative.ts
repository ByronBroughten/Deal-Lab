import { TextStyle, ViewStyle } from "react-native";

export const reactNativeS = {
  view: <VS extends ViewStyle>(styles: VS) => styles,
  text: <TS extends TextStyle>(styles: TS) => styles,
};
