import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { relVarb, relVarbS } from "../rel/relVarb";
import { updateBasicsS } from "../rel/relVarb/UpdateBasics";
import { updateFnPropS, updateFnPropsS } from "../rel/relVarb/UpdateFnProps";
import {
  overrideSwitchS,
  updateOverride,
  updateOverrideS,
} from "../rel/relVarb/UpdateOverrides";
import { RelVarbs, relVarbsS } from "../relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercentDecimal");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

export function mgmtRelVarbs(): RelVarbs<"mgmt"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,
    [rentCut.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [rentCut.decimal]: relVarbS.numObj("Rent cut decimal", {
      initNumber: 0.05,
      updateFnName: "percentToDecimal",
      updateFnProps: {
        num: updateFnPropS.local(rentCut.percent),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(rentCut.switch, "dollars")],
          updateBasicsS.equationLeftRight(
            "simpleDivide",
            updateFnPropS.local(rentCutDollars.monthly),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
          )
        ),
      ],
    }),
    rentCutPercentEditor: relVarbS.percentObj("Rent cut", {
      initNumber: 0,
    }),
    [rentCut.percent]: relVarbS.percentObj("Rent cut input", {
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        varbInfo: updateFnPropS.local("rentCutPercentEditor"),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(rentCut.switch, "dollars")],
          updateBasicsS.equationSimple(
            "decimalToPercent",
            updateFnPropS.local(rentCut.decimal)
          )
        ),
      ],
      displayNameEnd: " percent",
    }),
    [rentCutDollars.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    rentCutDollarsEditor: relVarbS.moneyObj("Rent cut dollars", {
      initNumber: 0,
      displayName: "Rent cut input dollars",
    }),
    [rentCutDollars.monthly]: relVarbS.moneyMonth("Rent cut", {
      displayNameEnd: " monthly",
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        switch: updateFnPropS.local(rentCut.switch),
        varbInfo: updateFnPropS.local("rentCutDollarsEditor"),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(rentCut.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(rentCut.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentMonthly")
          )
        ),
        updateOverrideS.yearlyIfActive("rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: relVarbS.moneyYear("Rent cut", {
      displayNameEnd: " yearly",
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        varbInfo: updateFnPropS.local("rentCutDollarsEditor"),
      },
      updateOverrides: [
        updateOverride(
          [overrideSwitchS.local(rentCut.switch, "percent")],
          updateBasicsS.equationLeftRight(
            "simpleMultiply",
            updateFnPropS.local(rentCut.decimal),
            updateFnPropS.pathName("propertyGeneralFocal", "targetRentYearly")
          )
        ),
        updateOverrideS.monthlyIfActive("rentCutDollars"),
      ],
    }),
    vacancyRatePercent: relVarbS.percentObj("Vacancy rate", {
      initNumber: 5,
      endAdornment: "%",
    }),
    vacancyRateDecimal: relVarbS.singlePropFn(
      "Vacancy rate decimal",
      "percentToDecimal",
      updateFnPropS.local("vacancyRatePercent"),
      {
        initNumber: 0.05,
        unit: "decimal",
      }
    ),
    ...relVarbsS.decimalToPortion(
      "vacancyLossDollars",
      "Vacancy rent lost",
      (baseVarbName) =>
        updateFnPropS.pathName("propertyGeneralFocal", baseVarbName),
      "targetRent",
      "vacancyRateDecimal"
    ),
    upfrontExpenses: relVarbS.sumNums(
      "Upfront expenses",
      [updateFnPropS.children("upfrontExpenseValue", "value")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        updateFnPropS.children("ongoingExpenseValue", "value"),
        ...updateFnPropsS.localArr(["vacancyLossDollars", "rentCutDollars"]),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
  };
}
