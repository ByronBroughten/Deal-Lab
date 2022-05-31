import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

export default function LabeledOutputRowSimple({
  className,
  children,
}: StandardProps) {
  return (
    <Styled className={`LabeledOutputRowSimple-root ${className}`}>
      {children}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  .LabeledVarb-root {
    margin: ${theme.s2};
    margin-top: 0;
  }
`;
