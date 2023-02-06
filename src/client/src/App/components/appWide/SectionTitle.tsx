import styled from "styled-components";
import theme from "../../theme/Theme";

type Props = { className?: string; text: React.ReactNode };
export function SectionTitle({ className, text }: Props) {
  return (
    <Styled className={`SectionTitle-root ${className ?? ""}`}>{text}</Styled>
  );
}
const Styled = styled.div`
  ${theme.titleChunk};
  .public-DraftEditor-content {
    min-height: 25px;
  }
`;
