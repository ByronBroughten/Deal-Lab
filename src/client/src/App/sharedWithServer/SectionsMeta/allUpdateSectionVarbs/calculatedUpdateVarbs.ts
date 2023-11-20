import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { updateVarbsS } from "../updateSectionVarbs/updateVarbs";

export function calculatedUpdateVarbs(): UpdateSectionVarbs<"calculatedVarbs"> {
  return {
    ...updateVarbsS._typeUniformity,
    currentYear: updateVarb("numObj", updateBasics("currentYear")),
    propertyAge: uvS.equationLR(
      "subtract",
      upS.varbPathName("currentYear"),
      upS.varbPathName("yearBuilt")
    ),
    pricePerUnit: uvS.equationLR(
      "divide",
      upS.varbPathName("purchasePrice"),
      upS.varbPathName("numUnits")
    ),
    pricePerSqft: uvS.equationLR(
      "divide",
      upS.varbPathName("purchasePrice"),
      upS.varbPathName("sqft")
    ),
    arvPerSqft: uvS.equationLR(
      "divide",
      upS.varbPathName("afterRepairValue"),
      upS.varbPathName("sqft")
    ),
    rehabPerSqft: uvS.divide(
      upS.varbPathName("rehabCost"),
      upS.varbPathName("sqft")
    ),
    // Property
    two: uvS.numObjB("two"),
    twelve: uvS.numObjB("twelve"),
    thirty: uvS.numObjB("thirty"),
    onePercentPrice: uvS.numEquation(
      "onePercent",
      upS.varbPathName("purchasePrice")
    ),
    twoPercentPrice: uvS.numEquation(
      "twoPercent",
      upS.varbPathName("purchasePrice")
    ),
    onePercentArv: uvS.numEquation(
      "onePercent",
      upS.varbPathName("afterRepairValue")
    ),
    twoPercentArv: uvS.numEquation(
      "twoPercent",
      upS.varbPathName("afterRepairValue")
    ),
    fivePercentRentMonthly: updateVarb("numObj", {
      ...ubS.equationSimple(
        "fivePercent",
        upS.varbPathName("targetRentMonthly")
      ),
    }),
    fivePercentRentYearly: updateVarb("numObj", {
      ...ubS.equationSimple(
        "fivePercent",
        upS.varbPathName("targetRentYearly")
      ),
    }),
    tenPercentRentMonthly: updateVarb("numObj", {
      ...ubS.equationSimple(
        "tenPercent",
        upS.varbPathName("targetRentMonthly")
      ),
    }),
    tenPercentRentYearly: updateVarb("numObj", {
      ...ubS.equationSimple("tenPercent", upS.varbPathName("targetRentYearly")),
    }),
    onePercentArvPlusSqft: updateVarb(
      "numObj",
      ubS.equationLR(
        "add",
        upS.local("onePercentArv"),
        upS.varbPathName("sqft")
      )
    ),
    onePercentPricePlusSqft: updateVarb(
      "numObj",
      ubS.varbPathLeftRight("add", "onePercentPrice", "sqft")
    ),
    onePercentArvSqftAverage: updateVarb(
      "numObj",
      ubS.equationLR(
        "divide",
        upS.local("onePercentArvPlusSqft"),
        upS.local("two")
      )
    ),
    onePercentPriceSqftAverage: updateVarb(
      "numObj",
      ubS.equationLR("divide", upS.local("onePercentArv"), upS.local("two"))
    ),
    threeHundred: updateVarb("numObj", updateBasics("solvableText300")),
    threeHundredPerUnit: updateVarb(
      "numObj",
      ubS.equationLR(
        "multiply",
        upS.local("threeHundred"),
        upS.varbPathName("numUnits")
      )
    ),
    threeHundredPerUnitTimesTwelve: updateVarb(
      "numObj",
      ubS.equationLR(
        "multiply",
        upS.local("threeHundredPerUnit"),
        upS.local("twelve")
      )
    ),
    propertyExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: {
        varbInfo: upS.pathName("propertyFocal", "one"),
      },
    }),

    mgmtExists: updateVarb("boolean", {
      initValue: false,
      updateFnName: "varbExists",
      updateFnProps: { varbInfo: upS.pathName("mgmtFocal", "one") },
    }),
  };
}
