import styled from "styled-components";
import theme from "../../theme/Theme";
import { LabeledVarb, LabeledVarbProps } from "./LabeledVarb";

type Props = { varbPropArr: LabeledVarbProps[]; className?: string };
export function LabeledVarbRow({ varbPropArr, className }: Props) {
  return (
    <StyledLabeledVarbRow className={`LabeledVarbRow-root ${className}`}>
      {varbPropArr.map((props) => (
        <LabeledVarb
          {...{
            ...props,
            key: props.feId,
          }}
        />
      ))}
    </StyledLabeledVarbRow>
  );
}

export const StyledLabeledVarbRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  .LabeledVarb-root {
    margin: ${theme.s25} ${theme.s25};
  }

  .LabeledVarb-label,
  .LabeledVarb-output {
    font-size: 1.3rem;
  }
`;
