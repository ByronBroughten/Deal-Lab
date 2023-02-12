import { Text } from "react-native";
import styled from "styled-components";
import { ModalSection, ModalSectionProps } from "./ModalSection";

interface Props extends ModalSectionProps {}
export function ModalText({ children, ...rest }: Props) {
  return (
    <Styled {...rest}>
      <Text>{children}</Text>
    </Styled>
  );
}

const Styled = styled(ModalSection)`
  .ModalSection-mainSection {
    max-width: 600px;
  }
`;
