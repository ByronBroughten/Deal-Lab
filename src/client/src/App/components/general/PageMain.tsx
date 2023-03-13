import { Text, View } from "react-native";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { NativeStandardProps } from "./StandardProps";

type Props = NativeStandardProps;

export function PageMain({ children, ...rest }: Props) {
  return <Styled {...rest}>{children}</Styled>;
}

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

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 5;
  background: ${theme.light};
  overflow-x: visible;
`;
