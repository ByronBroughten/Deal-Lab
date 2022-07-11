import { SectionPack } from "../SectionPack/SectionPack";
import { FeStoreTableName } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

type TablePackMakers = {
  [CN in FeStoreTableName]: () => SectionPack<"table">;
};
export function makeDefaultFeStoreTables(): TablePackMakers {
  const columnVarbnames = {
    dealTable: outputNames,
    propertyTable: ["price", "numBedrooms", "targetRentMonthly"],
    loanTable: ["interestRatePercentMonthly", "loanTermYears"],
    mgmtTable: [
      "vacancyRatePercent",
      "rentCutPercent",
      "ongoingExpensesMonthly",
      "upfrontExpensesMonthly",
    ],
  } as const;

  return Obj.keys(columnVarbnames).reduce((packMakers, sectionName) => {
    packMakers[sectionName] = (): SectionPack<"table"> => {
      const parent = PackBuilderSection.initAsOmniParent();
      const table = parent.addAndGetChild("table");
      for (const varbName of columnVarbnames[sectionName]) {
        table.addChild("column", {
          dbVarbs: {
            id: "local",
            infoType: "relative",
            sectionName,
            varbName,
          },
        });
      }
      return table.makeSectionPack();
    };
    return packMakers;
  }, {} as TablePackMakers);
}
