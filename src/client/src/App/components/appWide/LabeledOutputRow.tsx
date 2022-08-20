import styled from "styled-components";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

export function LabeledOutputRow({ className, children }: StandardProps) {
  return (
    <Styled className={`LabeledVarbRow-root ${className}`}>{children}</Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  padding-left: ${theme.s15};
  padding-right: ${theme.s15};
  .LabeledVarb-root {
    margin: ${theme.s25} ${theme.s15};
  }

  .LabeledVarb-label {
    font-size: 1.3rem;
  }
  .LabeledVarb-output {
    font-size: 1.3rem;
  }
`;
