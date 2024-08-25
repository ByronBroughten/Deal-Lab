import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { updateBasicsS } from "../updateVarb/UpdateBasics";
import { updatePropS } from "../updateVarb/UpdateFnProps";
import { uosS } from "../updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateVarbs";

const fnProp = updatePropS;
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
      updateOverrides: uosS.valueSource("overrunValueSource", {
        valueDollarsEditor: basics.loadLocal("valueDollarsEditor"),
        valuePercentEditor: basics.equationLR(
          "multiply",
          fnProp.local("valueDecimal"),
          fnProp.varbPathName("rehabCostBase")
        ),
      }),
    }),
    valueDecimal: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: uosS.valueSource("overrunValueSource", {
        valueDollarsEditor: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("rehabCostBase")
        ),
        valuePercentEditor: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercentEditor")
        ),
      }),
    }),
    valuePercent: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: uosS.valueSource("overrunValueSource", {
        valuePercentEditor: basics.loadLocal("valuePercentEditor"),
        valueDollarsEditor: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
      }),
    }),
  };
}
