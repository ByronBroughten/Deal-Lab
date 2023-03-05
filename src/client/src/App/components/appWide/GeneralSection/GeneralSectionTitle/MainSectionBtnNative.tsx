import { View, ViewStyle } from "react-native";
import styled from "styled-components";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { PlainIconBtn, PlainIconBtnProps } from "../../../general/PlainIconBtn";

export function MainSectionBtnNative({
  style: { marginRight, ...style } = {},
  className,
  ...rest
}: PlainIconBtnProps) {
  return (
    <View
      style={{
        borderRadius: nativeTheme.br0,
        marginRight,
        ...nativeTheme.boxShadow1,
        ...(style as ViewStyle),
      }}
    >
      <Styled
        {...{
          ...rest,
          style: {
            borderRadius: nativeTheme.br0,
            display: "flex",
            flexDirection: "row",
            fontSize: nativeTheme.fs20,
            ...style,
          },
        }}
      />
    </View>
  );
}

const Styled = styled(PlainIconBtn)`
  display: flex;
  flex: 1;
  background-color: ${nativeTheme.light};
  color: ${nativeTheme.primary.main};
  :hover {
    background-color: ${nativeTheme.secondary.main};
    color: ${nativeTheme.light};
    box-shadow: none;
  }
`;
