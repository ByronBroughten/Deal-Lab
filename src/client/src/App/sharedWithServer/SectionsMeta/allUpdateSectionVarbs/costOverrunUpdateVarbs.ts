import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import { updateBasicsS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updatePropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { uosS } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

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
