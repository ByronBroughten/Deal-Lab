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
const basics = updateBasicsS;
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
    onePercentPrice: updateVarb(
      "numObj",
      basics.equationSimple("onePercent", propS.varbPathName("purchasePrice"))
    ),
    twoPercentPrice: updateVarb(
      "numObj",
      basics.equationSimple(
        "twoPercent",
        propS.pathNameBase("propertyFocal", "purchasePrice")
      )
    ),
    onePercentArv: updateVarb(
      "numObj",
      basics.equationSimple(
        "onePercent",
        propS.pathNameBase("propertyFocal", "afterRepairValue")
      )
    ),
    twoPercentArv: updateVarb(
      "numObj",
      basics.equationSimple(
        "twoPercent",
        propS.varbPathName("afterRepairValue")
      )
    ),
    fivePercentRentMonthly: updateVarb("numObj", {
      ...basics.equationSimple(
        "fivePercent",
        propS.varbPathName("targetRentMonthly")
      ),
    }),
    fivePercentRentYearly: updateVarb("numObj", {
      ...basics.equationSimple(
        "fivePercent",
        propS.varbPathName("targetRentYearly")
      ),
    }),
    tenPercentRentMonthly: updateVarb("numObj", {
      ...basics.equationSimple(
        "tenPercent",
        propS.varbPathName("targetRentMonthly")
      ),
    }),
    tenPercentRentYearly: updateVarb("numObj", {
      ...basics.equationSimple(
        "tenPercent",
        propS.varbPathName("targetRentYearly")
      ),
    }),
    onePercentArvPlusSqft: updateVarb(
      "numObj",
      basics.equationLR(
        "add",
        propS.local("onePercentArv"),
        propS.varbPathName("sqft")
      )
    ),
    onePercentPricePlusSqft: updateVarb(
      "numObj",
      basics.varbPathLeftRight("add", "onePercentPrice", "sqft")
    ),
    onePercentArvSqftAverage: updateVarb(
      "numObj",
      basics.equationLR(
        "divide",
        propS.local("onePercentArvPlusSqft"),
        propS.local("two")
      )
    ),
    onePercentPriceSqftAverage: updateVarb(
      "numObj",
      basics.equationLR(
        "divide",
        propS.local("onePercentArv"),
        propS.local("two")
      )
    ),
    threeHundred: updateVarb("numObj", updateBasics("solvableText300")),
    threeHundredPerUnit: updateVarb(
      "numObj",
      basics.equationLR(
        "multiply",
        propS.local("threeHundred"),
        propS.varbPathName("numUnits")
      )
    ),
    threeHundredPerUnitTimesTwelve: updateVarb(
      "numObj",
      basics.equationLR(
        "multiply",
        propS.local("threeHundredPerUnit"),
        propS.local("twelve")
      )
    ),
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
