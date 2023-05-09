import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/updateVarbUtils";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const fnProp = updateFnPropS;
const basics = updateBasicsS;
export function costOverrunUpdateVarbs(): UpdateSectionVarbs<"costOverrunValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valuePercentEditor: updateVarb("numObj"),
    valueDollarsEditor: updateVarb("numObj"),
    valueSourceName: updateVarb("overrunValueSource", {
      initValue: "valuePercentEditor",
    }),
    valueDollars: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: valueSourceOverrides("overrunValueSource", {
        valueDollarsEditor: basics.loadFromLocal("valueDollarsEditor"),
        valuePercentEditor: basics.equationLR(
          "multiply",
          fnProp.local("valueDecimal"),
          fnProp.varbPathName("rehabCostBase")
        ),
      }),
    }),
    valueDecimal: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: valueSourceOverrides("overrunValueSource", {
        valueDollarsEditor: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("repairCostBase")
        ),
        valuePercentEditor: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercentEditor")
        ),
      }),
    }),
    valuePercent: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: valueSourceOverrides("overrunValueSource", {
        valuePercentEditor: basics.loadFromLocal("valuePercentEditor"),
        valueDollarsEditor: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
      }),
    }),
  };
}
