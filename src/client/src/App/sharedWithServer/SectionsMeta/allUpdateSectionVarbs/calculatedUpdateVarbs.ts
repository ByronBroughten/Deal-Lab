import { USVS, usvs } from "../updateSectionVarbs/updateSectionVarbs";
import { updateVarb, uvS } from "../updateSectionVarbs/updateVarb";
import {
  ubS,
  updateBasics,
} from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";

export function calculatedUpdateVarbs(): USVS<"calculatedVarbs"> {
  return usvs("calculatedVarbs", {
    currentYear: updateVarb("numObj", updateBasics("currentYear")),
    propertyAge: uvS.subtract(
      upS.varbPathName("currentYear"),
      upS.varbPathName("yearBuilt")
    ),
    pricePerUnit: uvS.divide(
      upS.varbPathName("purchasePrice"),
      upS.varbPathName("numUnits")
    ),
    pricePerSqft: uvS.divide(
      upS.varbPathName("purchasePrice"),
      upS.varbPathName("sqft")
    ),
    arvPerSqft: uvS.divide(
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
    fivePercentRentMonthly: uvS.numEquation(
      "fivePercent",
      upS.varbPathName("targetRentMonthly")
    ),
    fivePercentRentYearly: uvS.numEquation(
      "fivePercent",
      upS.varbPathName("targetRentYearly")
    ),
    tenPercentRentMonthly: uvS.numEquation(
      "tenPercent",
      upS.varbPathName("targetRentMonthly")
    ),
    tenPercentRentYearly: uvS.numEquation(
      "tenPercent",
      upS.varbPathName("targetRentYearly")
    ),
    onePercentArvPlusSqft: uvS.add("onePercentArv", upS.varbPathName("sqft")),
    onePercentPricePlusSqft: uvS.numObjB2(
      ubS.varbPathLeftRight("add", "onePercentPrice", "sqft")
    ),
    onePercentArvSqftAverage: uvS.divide("onePercentArvPlusSqft", "two"),
    onePercentPriceSqftAverage: uvS.divide("onePercentPricePlusSqft", "two"),
    threeHundred: uvS.numObjB("solvableText300"),
    threeHundredPerUnit: uvS.multiply(
      "threeHundred",
      upS.varbPathName("numUnits")
    ),
    threeHundredPerUnitTimesTwelve: uvS.multiply(
      "threeHundredPerUnit",
      "twelve"
    ),
  });
}
