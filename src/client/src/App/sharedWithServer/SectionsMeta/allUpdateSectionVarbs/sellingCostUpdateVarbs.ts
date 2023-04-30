import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb } from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { valueSourceOverrides } from "../updateSectionVarbs/updateVarb/UpdateOverrides";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const fnProp = updateFnPropS;
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
      updateOverrides: valueSourceOverrides("sellingCostSource", {
        valueDollarsEditor: basics.loadFromLocal("valueDollarsEditor"),
        itemize: basics.loadFromChild("singleTimeList", "total"),
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
      updateOverrides: valueSourceOverrides("sellingCostSource", {
        valueDollarsEditor: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("afterRepairValue")
        ),
        itemize: basics.equationLR(
          "divide",
          fnProp.local("valueDollarsEditor"),
          fnProp.varbPathName("afterRepairValue")
        ),
        valuePercentEditor: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercentEditor")
        ),
        sixPercent: basics.equationSimple(
          "percentToDecimal",
          fnProp.local("valuePercentEditor")
        ),
      }),
    }),
    valuePercent: updateVarb("numObj", {
      ...basics.throw,
      updateOverrides: valueSourceOverrides("sellingCostSource", {
        sixPercent: updateBasics("six"),
        valuePercentEditor: basics.loadFromLocal("valuePercentEditor"),
        valueDollarsEditor: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
        itemize: basics.equationSimple(
          "decimalToPercent",
          fnProp.local("valueDecimal")
        ),
      }),
    }),
  };
}
