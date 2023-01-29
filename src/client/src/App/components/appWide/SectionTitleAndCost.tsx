import styled from "styled-components";
import theme from "../../theme/Theme";
import StandardLabel from "../general/StandardLabel";

type Props = { className?: string; text: string; cost?: string };
export function SectionTitleAndCost({ className, text, cost }: Props) {
  return (
    <Styled className={`SectionTitleAndCost-root ${className ?? ""}`}>
      <StandardLabel>{text}</StandardLabel>
      {cost && <div className="SectionTitleAndCost-cost">{cost}</div>}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;

  .SectionTitleAndCost-cost {
    font-size: 17px;
    padding-left: ${theme.s25};
    color: ${theme["gray-600"]};
  }
`;
