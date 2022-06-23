import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { defaultDealOutputInfos } from "./makeDefaultOutputList";

const columnVarbInfos = {
  deal: defaultDealOutputInfos,
  property: ["price", "numBedrooms", "targetRentMonthly"],
  loan: ["interestRatePercentMonthly", "loanTermYears"],
  mgmt: [
    "vacancyRatePercent",
    "rentCutPercent",
    "ongoingExpensesMonthly",
    "upfrontExpensesMonthly",
  ],
} as const;

function makeDefaultTablePacks() {
  const parent = PackBuilderSection.initAsOmniParent();

  const dealTable = parent.addAndGetChild("table");
  for (const outputVarbInfo of defaultDealOutputInfos) {
    dealTable.addChild("column", {
      dbVarbs: outputVarbInfo,
    });
  }

  const varbInfo = {
    id: "local",
    idType: "relative",
    sectionName: "property",
    varbName: "price",
  };

  // const propertyTable = parent.addAnd;
}
