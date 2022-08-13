import { Checkbox, FormControlLabel } from "@material-ui/core";
import styled from "styled-components";
import { PiCalculationName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/calculations/piCalculations";
import { useSetterVarb } from "../../../../sharedWithServer/stateClassHooks/useSetterVarb";
import theme from "../../../../theme/Theme";

type PiCalculationControlProps = { feId: string };
export function PiCalculationControl({ feId }: PiCalculationControlProps) {
  const varb = useSetterVarb({
    feId,
    sectionName: "loan",
    varbName: "piCalculationName",
  });

  const piCalculationName = varb.value("string") as PiCalculationName;
  function changeCheckBox(): void {
    const nextCalcName =
      piCalculationName === "piFixedStandard"
        ? "interestOnlySimple"
        : ("piFixedStandard" as PiCalculationName);
    varb.updateValue(nextCalcName);
  }

  return (
    <Styled>
      <FormControlLabel
        label="Interest only payments"
        style={{
          padding: 0,
        }}
        control={
          <Checkbox
            style={{
              color: theme.loan.dark,
              padding: 0,
            }}
            checked={piCalculationName === "interestOnlySimple"}
            onChange={changeCheckBox}
          />
        }
      />
    </Styled>
  );
}

const Styled = styled.div`
  padding-top: ${theme.s1};
  .MuiFormControlLabel-root {
    display: flex;
    margin-right: 0;
    margin-left: -1px;
    margin-bottom: -1px;
  }
  .MuiTypography-root {
    font-size: 0.92rem;
    line-height: 1.2;
    margin-left: ${theme.s1};
  }
`;
