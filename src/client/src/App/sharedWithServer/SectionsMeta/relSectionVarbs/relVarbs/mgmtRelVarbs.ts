import { switchNames } from "../../baseSectionsVarbs/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
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
        num: relVarbInfoS.local(rentCut.percent),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "simpleDivide",
          updateFnProps: {
            leftSide: relVarbInfoS.local(rentCutDollars.monthly),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentMonthly",
              { expectedCount: "onlyOne" }
            ),
          },
        },
      ],
    }),
    rentCutPercentEditor: relVarbS.percentObj("Rent cut", {
      initNumber: 5,
    }),
    [rentCut.percent]: relVarbS.percentObj("Rent cut", {
      updateFnName: "loadSolvableText",
      updateFnProps: {
        varbInfo: relVarbInfoS.local("rentCutPercentEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "dollars",
          updateFnName: "decimalToPercent",
          updateFnProps: { num: relVarbInfoS.local(rentCut.decimal) },
        },
      ],
      displayNameEnd: " percent",
    }),
    [rentCutDollars.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    rentCutDollarsEditor: relVarbS.moneyObj("Rent cut dollars", {
      initNumber: 0,
      displayNameEnd: " rent cut dollars input",
    }),
    [rentCutDollars.monthly]: relVarbS.moneyMonth("Rent cut", {
      displayNameEnd: " dollars monthly",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        switch: relVarbInfoS.local(rentCut.switch),
        varbInfo: relVarbInfoS.local("rentCutDollarsEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            switch: relVarbInfoS.local(rentCut.switch),
            leftSide: relVarbInfoS.local(rentCut.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentMonthly",
              { expectedCount: "onlyOne" }
            ),
          },
        },
        relUpdateSwitch.yearlyToMonthly("rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: relVarbS.moneyYear("Rent cut", {
      displayNameEnd: " dollars yearly",
      updateFnName: "loadSolvableText",
      updateFnProps: {
        varbInfo: relVarbInfoS.local("rentCutDollarsEditor"),
      },
      inUpdateSwitchProps: [
        {
          switchInfo: relVarbInfoS.local(rentCut.switch),
          switchValue: "percent",
          updateFnName: "simpleMultiply",
          updateFnProps: {
            leftSide: relVarbInfoS.local(rentCut.decimal),
            rightSide: relVarbInfoS.pibling(
              "propertyGeneral",
              "propertyGeneral",
              "targetRentYearly",
              { expectedCount: "onlyOne" }
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
      relVarbInfoS.local("vacancyRatePercent"),
      {
        initNumber: 0.05,
        unit: "decimal",
      }
    ),
    ...relVarbsS.decimalToPortion(
      "vacancyLossDollars",
      "Vacancy rent lost",
      (baseVarbName) => {
        return relVarbInfoS.pibling(
          "propertyGeneral",
          "propertyGeneral",
          baseVarbName,
          { expectedCount: "onlyOne" }
        );
      },
      "targetRent",
      "vacancyRateDecimal"
    ),
    upfrontExpenses: relVarbS.sumNums(
      "Upfront expenses",
      [relVarbInfoS.children("upfrontCostListGroup", "total")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        relVarbInfoS.children("ongoingCostListGroup", "total"),
        ...relVarbInfosS.local(["vacancyLossDollars", "rentCutDollars"]),
      ],
      {
        switchInit: "monthly",
        shared: { startAdornment: "$" },
      }
    ),
  };
}
