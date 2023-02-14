import { StyleSheet, Text } from "react-native";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { ModalSection, ModalSectionProps } from "./ModalSection";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: theme.dark,
  },
});

interface Props extends ModalSectionProps {}
export function ModalText({ children, ...rest }: Props) {
  return (
    <Styled {...rest}>
      <Text style={styles.text}>{children}</Text>
    </Styled>
  );
}

const Styled = styled(ModalSection)`
  .ModalSection-mainSection {
    max-width: 600px;
  }
`;
