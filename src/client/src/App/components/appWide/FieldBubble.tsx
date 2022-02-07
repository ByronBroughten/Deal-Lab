import styled from "styled-components";
import theme, { ThemeSectionName } from "../../theme/Theme";

type Props = { className?: string; sectionName: ThemeSectionName };
export default function FieldBubble({ className, ...rest }: Props) {
  return (
    <Styled {...{ className: "FieldBubble-root " + className, ...rest }} />
  );
}
const Styled = styled.div<{ sectionName: ThemeSectionName }>`
  background-color: ${({ sectionName }) => theme[sectionName].light};
  border-radius: ${theme.br1};
  padding: ${theme.s2};
  display: inline-block;
`;
