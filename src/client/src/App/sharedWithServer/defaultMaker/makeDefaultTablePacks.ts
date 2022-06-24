import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionName } from "../SectionsMeta/SectionName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

const columnVarbnames = {
  deal: outputNames,
  property: ["price", "numBedrooms", "targetRentMonthly"],
  loan: ["interestRatePercentMonthly", "loanTermYears"],
  mgmt: [
    "vacancyRatePercent",
    "rentCutPercent",
    "ongoingExpensesMonthly",
    "upfrontExpensesMonthly",
  ],
} as const;

type TablePacks = {
  [SN in SectionName<"tableSource">]: SectionPackRaw<"table">;
};
export function makeDefaultTablePacks(): TablePacks {
  const parent = PackBuilderSection.initAsOmniParent();
  return Obj.keys(columnVarbnames).reduce((tablePacks, sectionName) => {
    const table = parent.addAndGetChild("table");
    for (const varbName of columnVarbnames[sectionName]) {
      table.addChild("column", {
        dbVarbs: {
          id: "local",
          idType: "relative",
          sectionName,
          varbName,
        },
      });
    }
    tablePacks[sectionName] = table.makeSectionPack();
    return tablePacks;
  }, {} as TablePacks);
}
