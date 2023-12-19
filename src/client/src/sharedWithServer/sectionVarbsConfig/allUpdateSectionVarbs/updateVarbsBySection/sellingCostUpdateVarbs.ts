import { UpdateSectionVarbs } from "../updateSectionVarbs";
import { updateVarb } from "../updateVarb";
import { updateBasics, updateBasicsS } from "../updateVarb/UpdateBasics";
import { updatePropS } from "../updateVarb/UpdateFnProps";
import { uosS } from "../updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateVarbs";

const fnProp = updatePropS;
const basics = updateBasicsS;
export function sellingCostUpdateVarbs(): UpdateSectionVarbs<"sellingCostValue"> {
  return {
    ...updateVarbsS._typeUniformity,
    valuePercentEditor: updateVarb("numObj"),
    valueDollarsEditor: updateVarb("numObj"),
    valueSourceName: updateVarb("sellingCostSource", {
      initValue: "sixPercent",
    }),
    valueDollars: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: uosS.valueSource("sellingCostSource", {
        listTotal: basics.loadChild("onetimeList", "total"),
        valueDollarsEditor: basics.loadLocal("valueDollarsEditor"),
        valuePercentEditor: basics.equationLR(
          "multiply",
          fnProp.local("valueDecimal"),
          fnProp.varbPathName("afterRepairValue")
        ),
        sixPercent: basics.equationLR(
          "multiply",
          fnProp.local("valueDecimal"),
          fnProp.varbPathName("afterRepairValue")
        ),
      }),
    }),
    valueDecimal: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: uosS.valueSource("sellingCostSource", {
        valueDollarsEditor: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("afterRepairValue")
        ),
        listTotal: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("afterRepairValue")
        ),
        valuePercentEditor: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercent")
        ),
        sixPercent: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercent")
        ),
      }),
    }),
    valuePercent: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: uosS.valueSource("sellingCostSource", {
        sixPercent: updateBasics("six"),
        valuePercentEditor: basics.loadLocal("valuePercentEditor"),
        valueDollarsEditor: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
        listTotal: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
      }),
    }),
  };
}
