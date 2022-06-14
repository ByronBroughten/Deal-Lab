import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

type Props = StandardProps & { $active?: boolean };
export default function StandardLabel({ className, ...props }: Props) {
  return (
    <Styled className={`StandardLabel-root ${className ?? ""}`} {...props} />
  );
}

const Styled = styled.label<{ $active?: boolean }>`
  line-height: 1;
  margin: 0;
  padding: 0;
  font-weight: 700;
  color: ${({ $active }) => ($active ? theme.next.dark : theme["gray-600"])}}
`;
