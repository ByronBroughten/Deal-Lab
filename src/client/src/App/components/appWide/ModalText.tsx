import { Text } from "react-native";
import styled from "styled-components";
import { ModalSectionProps, SectionModal } from "./ModalSection";

interface Props extends ModalSectionProps {}
export function ModalText({ children, ...rest }: Props) {
  return (
    <Styled {...rest}>
      <Text>{children}</Text>
    </Styled>
  );
}

const Styled = styled(SectionModal)`
  .SectionModal-mainSection {
    max-width: 600px;
  }
`;
