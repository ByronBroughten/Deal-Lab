import { FormControl, FormControlLabel, RadioGroup } from "@mui/material";
import { StateValue } from "../../../../../../../sharedWithServer/stateSchemas/StateValue";
import { useAction } from "../../../../../../../stateHooks/useAction";
import { useGetterSection } from "../../../../../../../stateHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import Radio from "../../../../../../general/Radio";

export function FinancingMethodSelector({ feId }: { feId: string }) {
  const updateValue = useAction("updateValue");
  const financing = useGetterSection({ sectionName: "financing", feId });
  const financingMethod = financing.valueNext("financingMethod");
  const methodVarb = financing.varbNext("financingMethod");
  const values: Record<string, StateValue<"financingMethod">> = {
    cashOnly: "cashOnly",
    useLoan: "useLoan",
  };
  return (
    <div>
      <FormControl
        className="Financing-financingTypeControl"
        sx={{
          m: 0,
          p: 0,
          mt: nativeTheme.s2,
          marginLeft: nativeTheme.s25,
          "& .Mui-checked": {
            color: nativeTheme.primary.main,
          },
          "& .MuiFormLabel-root": {
            fontSize: nativeTheme.inputEditor.fontSize,
            color: nativeTheme.dark,
          },
          "& .MuiFormControlLabel-label": {
            margin: 0,
            marginTop: nativeTheme.s15,
            marginLeft: nativeTheme.s25,
          },
        }}
      >
        <RadioGroup
          aria-labelledby="financing-type-radio-buttons-group"
          name="financing-type-radio-buttons-group"
          value={financingMethod}
          onChange={(e) =>
            updateValue({
              ...methodVarb.feVarbInfo,
              value: e.currentTarget.value,
            })
          }
        >
          <FormControlLabel
            value={values.cashOnly}
            control={<Radio color="primary" />}
            label="Cash Only"
          />
          <FormControlLabel
            value={values.useLoan}
            control={<Radio color="primary" />}
            label="Use Loan(s)"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
