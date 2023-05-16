import { FormControl, FormControlLabel, RadioGroup } from "@mui/material";
import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import Radio from "../../../../general/Radio";

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
