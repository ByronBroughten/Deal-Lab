import styled from "styled-components";
import theme from "../theme/Theme";

type Props = { className?: string };
export function AppFooter({ className }: Props) {
  return (
    <Styled className={`AppFooter-root ${className ?? ""}`}>
      Questions or feedback? support@ultimatepropertyanalyzer.com
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 0;
  justify-content: center;
  width: 100%;
  background: ${theme.deal.main};
  color: ${theme.dark};
  font-size: 14px;
  padding: ${theme.s1} 0;
`;
