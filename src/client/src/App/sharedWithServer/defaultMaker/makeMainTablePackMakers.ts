import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { SectionName } from "../SectionsMeta/SectionName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

type TablePackMakers = {
  [SN in SectionName<"tableSource">]: () => SectionPackRaw<"table">;
};
export function makeMainTablePackMakers(): TablePackMakers {
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

  return Obj.keys(columnVarbnames).reduce((packMakers, sectionName) => {
    packMakers[sectionName] = (): SectionPackRaw<"table"> => {
      const parent = PackBuilderSection.initAsOmniParent();
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
      return table.makeSectionPack();
    };
    return packMakers;
  }, {} as TablePackMakers);
}
