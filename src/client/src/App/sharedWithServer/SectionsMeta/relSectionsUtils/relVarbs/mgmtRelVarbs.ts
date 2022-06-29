import { switchNames } from "../../baseSectionsUtils/switchNames";
import { rel } from "../rel";
import { RelVarbs } from "../relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercent");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

export function mgmtRelVarbs<R extends RelVarbs<"mgmt">>(): R {
  const sectionName = "mgmt";
  return {
    ...rel.varbs.savableSection,
    [rentCut.switch]: rel.varb.string({
      initValue: "percent",
    }),
    [rentCut.percent]: rel.varb.percentObj("Rent cut", {
      initNumber: 5,
      inUpdateSwitchProps: [
        rel.updateSwitch.divideToPercent(
          sectionName,
          rentCut.switch,
          "dollars",
          rel.varbInfo.local(sectionName, rentCutDollars.monthly),
          rel.varbInfo.static("propertyGeneral", "targetRentMonthly")
        ),
      ],
    }),
    // SectionsMeta is the highest level.
    [rentCutDollars.switch]: rel.varb.string({
      initValue: "monthly",
    }),
    [rentCutDollars.monthly]: rel.varb.moneyMonth("Rent cut", {
      initNumber: 0,
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          sectionName,
          "rentCut",
          rel.varbInfo.static("propertyGeneral", "targetRentMonthly")
        ),
        rel.updateSwitch.yearlyToMonthly(sectionName, "rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: rel.varb.moneyYear("Rent cut", {
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          sectionName,
          "rentCut",
          rel.varbInfo.static("propertyGeneral", "targetRentYearly")
        ),
        rel.updateSwitch.monthlyToYearly(sectionName, "rentCutDollars"),
      ],
    }),
    vacancyRatePercent: rel.varb.percentObj("Vacancy Rate", {
      initNumber: 5,
      endAdornment: "%",
    }),
    ...rel.varbs.ongoingPercentToPortion(
      "vacancyLossDollars",
      "Vacancy rent lost",
      sectionName,
      "propertyGeneral",
      "targetRent",
      "vacancyRatePercent"
    ),
    upfrontExpenses: rel.varb.sumNums(
      "Upfront expenses",
      [rel.varbInfo.relative("singleTimeList", "total", "children")],
      { startAdornment: "$" }
    ),
    ...rel.varbs.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing mangement expenses",
      [
        rel.varbInfo.relative("ongoingList", "total", "children"),
        ...rel.varbInfo.locals(sectionName, [
          "vacancyLossDollars",
          "rentCutDollars",
        ]),
      ],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
}
