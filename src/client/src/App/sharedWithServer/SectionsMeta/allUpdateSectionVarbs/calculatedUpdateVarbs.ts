import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, updateVarbS } from "../updateSectionVarbs/updateVarb";
import {
  updateBasics,
  updateBasicsS,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { updateFnPropS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

const propS = updateFnPropS;
const varbS = updateVarbS;
export function calculatedUpdateVarbs(): UpdateSectionVarbs<"calculatedVarbs"> {
  return {
    ...updateVarbsS._typeUniformity,
    pricePerUnit: varbS.equationLR(
      "divide",
      propS.varbPathName("purchasePrice"),
      propS.varbPathName("numUnits")
    ),
    pricePerSqft: varbS.equationLR(
      "divide",
      propS.varbPathName("purchasePrice"),
      propS.varbPathName("sqft")
    ),
    arvPerSqft: varbS.equationLR(
      "divide",
      propS.varbPathName("afterRepairValue"),
      propS.varbPathName("sqft")
    ),
    rehabPerSqft: varbS.equationLR(
      "divide",
      propS.varbPathName("rehabCost"),
      propS.varbPathName("sqft")
    ),
    // Property
    two: updateVarb("numObj", updateBasics("two")),
    twelve: updateVarb("numObj", updateBasics("twelve")),
    onePercentPrice: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "onePercent",
        propS.pathNameBase("propertyFocal", "purchasePrice")
      ),
    }),
    twoPercentPrice: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "twoPercent",
        propS.pathNameBase("propertyFocal", "purchasePrice")
      ),
    }),
    fivePercentRentMonthly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "fivePercent",
        propS.varbPathName("targetRentMonthly")
      ),
    }),
    fivePercentRentYearly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "fivePercent",
        propS.varbPathName("targetRentYearly")
      ),
    }),
    tenPercentRentMonthly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "tenPercent",
        propS.varbPathName("targetRentMonthly")
      ),
    }),
    tenPercentRentYearly: updateVarb("numObj", {
      ...updateBasicsS.equationSimple(
        "tenPercent",
        propS.varbPathName("targetRentYearly")
      ),
    }),
    onePercentPricePlusSqft: updateVarb("numObj", {
      ...updateBasicsS.sumVarbPathName("onePercentPrice", "sqft"),
    }),
    onePercentPriceSqftAverage: updateVarb("numObj", {
      ...updateBasicsS.varbPathLeftRight(
        "divide",
        "onePercentPricePlusSqft",
        "two"
      ),
    }),
    propertyExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: {
        varbInfo: propS.pathName("propertyFocal", "one"),
      },
    }),

    mgmtExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: { varbInfo: propS.pathName("mgmtFocal", "one") },
    }),
  };
}
