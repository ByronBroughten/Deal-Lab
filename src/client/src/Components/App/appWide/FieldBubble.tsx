import styled from "styled-components";
import theme, { ThemeName } from "../../../theme/Theme";

type Props = { className?: string; sectionName: ThemeName };
export default function FieldBubble({ className, ...rest }: Props) {
  return (
    <Styled {...{ className: "FieldBubble-root " + className, ...rest }} />
  );
}
const Styled = styled.div<{ sectionName: ThemeName }>`
  background-color: ${({ sectionName }) => theme[sectionName].light};
  border-radius: ${theme.br0};
  padding: ${theme.s2};
  display: inline-block;
`;
