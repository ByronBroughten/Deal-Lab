import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { relVarbInfoS } from "../../SectionInfo/RelVarbInfo";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
import { updateFnPropS, updateFnPropsS } from "../rel/UpdateFnProps";
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
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: updateFnPropS.local(rentCutDollars.monthly),
            rightSide: updateFnPropS.pathName(
              "propertyGeneralFocal",
              "targetRentMonthly"
            ),
            // relVarbInfoS.pibling(
            //   "propertyGeneral",
            //   "propertyGeneral",
            //   "targetRentMonthly",
            //   { expectedCount: "onlyOne" }
            // ),
          },
        },
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
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: { num: updateFnPropS.local(rentCut.decimal) },
        },
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
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            switch: updateFnPropS.local(rentCut.switch),
            leftSide: updateFnPropS.local(rentCut.decimal),
            rightSide: updateFnPropS.pathName(
              "propertyGeneralFocal",
              "targetRentMonthly"
            ),
          },
        },
        relUpdateSwitch.yearlyToMonthly("rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: relVarbS.moneyYear("Rent cut", {
      displayNameEnd: " yearly",
      updateFnName: "loadSolvableTextByVarbInfo",
      updateFnProps: {
        varbInfo: updateFnPropS.local("rentCutDollarsEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            leftSide: updateFnPropS.local(rentCut.decimal),
            rightSide: updateFnPropS.pathName(
              "propertyGeneralFocal",
              "targetRentYearly"
            ),
          },
        },
        relUpdateSwitch.monthlyToYearly("rentCutDollars"),
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
      [updateFnPropS.children("upfrontCostListGroup", "total")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        updateFnPropS.children("ongoingCostListGroup", "total"),
        ...updateFnPropsS.localArr(["vacancyLossDollars", "rentCutDollars"]),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
  };
}
