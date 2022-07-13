import { switchNames } from "../../baseSectionsUtils/RelSwitchVarb";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relUpdateSwitch } from "../rel/relUpdateSwitch";
import { relVarb, relVarbS } from "../rel/relVarb";
import { RelVarbs, relVarbsS } from "../relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercent");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

export function mgmtRelVarbs<R extends RelVarbs<"mgmt">>(): R {
  return {
    ...relVarbsS.savableSection,
    [rentCut.switch]: relVarb("string", {
      initValue: "percent",
    }),
    [rentCut.percent]: relVarbS.percentObj("Rent cut", {
      initNumber: 5,
      inUpdateSwitchProps: [
        relUpdateSwitch.divideToPercent(
          rentCut.switch,
          "dollars",
          relVarbInfoS.local(rentCutDollars.monthly),
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentMonthly",
            { expectedCount: "onlyOne" }
          )
        ),
      ],
      displayNameEnd: " percent",
    }),
    // SectionsMeta is the highest level.
    [rentCutDollars.switch]: relVarb("string", {
      initValue: "monthly",
    }),
    [rentCutDollars.monthly]: relVarbS.moneyMonth("Rent cut", {
      initNumber: 0,
      inUpdateSwitchProps: [
        relUpdateSwitch.percentToDecimalTimesBase(
          "rentCut",
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentMonthly",
            { expectedCount: "onlyOne" }
          )
        ),
        relUpdateSwitch.yearlyToMonthly("rentCutDollars"),
      ],
      displayNameEnd: " dollars monthly",
    }),
    [rentCutDollars.yearly]: relVarbS.moneyYear("Rent cut", {
      inUpdateSwitchProps: [
        relUpdateSwitch.percentToDecimalTimesBase(
          "rentCut",
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentYearly",
            { expectedCount: "onlyOne" }
          )
        ),
        relUpdateSwitch.monthlyToYearly("rentCutDollars"),
      ],
      displayNameEnd: " dollars yearly",
    }),
    vacancyRatePercent: relVarbS.percentObj("Vacancy Rate", {
      initNumber: 5,
      endAdornment: "%",
    }),
    ...relVarbsS.ongoingPercentToPortion(
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
      "vacancyRatePercent"
    ),
    upfrontExpenses: relVarbS.sumNums(
      "Upfront expenses",
      [relVarbInfoS.children("upfrontCostList", "total")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing expenses",
      [
        relVarbInfoS.children("ongoingCostList", "total"),
        ...relVarbInfosS.local(["vacancyLossDollars", "rentCutDollars"]),
      ],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
}
