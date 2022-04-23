import { ContextName } from "../baseSections";
import { switchNames } from "../baseSections/switchNames";
import { rel } from "./rel";
import { relSection } from "./rel/relSection";
import { RelVarbs } from "./rel/relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercent");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

const mgmtPreVarbs: RelVarbs<ContextName, "mgmt"> = {
  title: rel.varb.string(),
  [rentCut.switch]: rel.varb.string({ initValue: "percent" }),
  [rentCut.percent]: rel.varb.percentObj("Rent cut", {
    initNumber: 5,
    inUpdateSwitchProps: [
      rel.updateSwitch.divideToPercent(
        "mgmt",
        rentCut.switch,
        "dollars",
        rel.varbInfo.local("mgmt", rentCutDollars.monthly),
        rel.varbInfo.static("propertyGeneral", "targetRentMonthly")
      ),
    ],
  }),
  // SectionMetas is the highest level.
  [rentCutDollars.switch]: rel.varb.string({
    initValue: "monthly",
  }),
  [rentCutDollars.monthly]: rel.varb.moneyMonth("Rent cut", {
    initNumber: 0,
    inUpdateSwitchProps: [
      rel.updateSwitch.percentToDecimalTimesBase(
        "mgmt",
        "rentCut",
        rel.varbInfo.static("propertyGeneral", "targetRentMonthly")
      ),
      rel.updateSwitch.yearlyToMonthly("mgmt", "rentCutDollars"),
    ],
  }),
  [rentCutDollars.yearly]: rel.varb.moneyYear("Rent cut", {
    inUpdateSwitchProps: [
      rel.updateSwitch.percentToDecimalTimesBase(
        "mgmt",
        "rentCut",
        rel.varbInfo.static("propertyGeneral", "targetRentYearly")
      ),
      rel.updateSwitch.monthlyToYearly("mgmt", "rentCutDollars"),
    ],
  }),
  vacancyRatePercent: rel.varb.percentObj("Vacancy Rate", {
    initNumber: 5,
    endAdornment: "%",
  }),
  ...rel.varbs.ongoingPercentToPortion(
    "vacancyLossDollars",
    "Vacancy rent lost",
    "mgmt",
    "propertyGeneral",
    "targetRent",
    "vacancyRatePercent"
  ),
  upfrontExpenses: rel.varb.sumNums(
    "Upfront expenses",
    [rel.varbInfo.relative("upfrontCostList", "total", "children")],
    { startAdornment: "$" }
  ),
  ...rel.varbs.ongoingSumNums(
    "ongoingExpenses",
    "Ongoing mangement expenses",
    [
      rel.varbInfo.relative("ongoingCostList", "total", "children"),
      ...rel.varbInfo.locals("mgmt", ["vacancyLossDollars", "rentCutDollars"]),
    ],
    { switchInit: "monthly", shared: { startAdornment: "$" } }
  ),
} as const;

export const preMgmtGeneral = {
  ...relSection.base(
    "fe" as ContextName,
    "mgmtGeneral",
    "Management",
    {
      ...rel.varbs.sumSection("mgmt", { ...mgmtPreVarbs }),
      ...rel.varbs.sectionStrings("mgmt", { ...mgmtPreVarbs }, ["title"]),
    },
    {
      childNames: ["mgmt", "mgmtIndex", "mgmtDefault", "mgmtTable"] as const,
      alwaysOne: true,
      initOnStartup: true,
      parent: "main",
    }
  ),
  ...relSection.base(
    "fe" as ContextName,
    "mgmt",
    "Management",
    { ...mgmtPreVarbs },
    {
      parent: "mgmtGeneral",
      childNames: ["upfrontCostList", "ongoingCostList"] as const,
      makeOneOnStartup: true,
      indexStoreName: "mgmtIndex",
      defaultStoreName: "mgmtDefault",
    }
  ),
  ...relSection.rowIndex("mgmtIndex", "Management Index"),
  ...relSection.base(
    "fe" as ContextName,
    "mgmtDefault",
    "Default Management",
    { ...mgmtPreVarbs },
    {
      parent: "mgmtGeneral",
      childNames: ["upfrontCostList", "ongoingCostList"] as const,
      makeOneOnStartup: true,
    }
  ),
  ...rel.section.managerTable("mgmtTable", "Management Table", "mgmtIndex"),
};
