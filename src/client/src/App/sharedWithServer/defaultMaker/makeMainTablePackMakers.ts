import { SectionPack } from "../SectionPack/SectionPack";
import { InEntityInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/InEntityInfoValue";
import { Id } from "../SectionsMeta/baseSectionsUtils/id";
import { FeStoreTableName } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

type TablePackMakers = {
  [CN in FeStoreTableName]: () => SectionPack<"table">;
};
export function makeDefaultFeStoreTables(): TablePackMakers {
  const columnVarbnames = {
    dealTable: {
      sectionName: "deal",
      varbNames: outputNames,
    },
    propertyTable: {
      sectionName: "property",
      varbNames: ["price", "numBedrooms", "targetRentMonthly"],
    },
    loanTable: {
      sectionName: "loan",
      varbNames: ["interestRatePercentMonthly", "loanTermYears"],
    },
    mgmtTable: {
      sectionName: "mgmt",
      varbNames: [
        "vacancyRatePercent",
        "rentCutPercent",
        "ongoingExpensesMonthly",
        "upfrontExpensesMonthly",
      ],
    },
  } as const;

  return Obj.keys(columnVarbnames).reduce((packMakers, tableName) => {
    packMakers[tableName] = (): SectionPack<"table"> => {
      const parent = PackBuilderSection.initAsOmniParent();
      const table = parent.addAndGetChild("table");
      const { sectionName, varbNames } = columnVarbnames[tableName];
      for (const varbName of varbNames) {
        table.addChild("column", {
          dbVarbs: {
            varbInfo: {
              infoType: "globalSection",
              expectedCount: "onlyOne",
              sectionName,
              varbName,
              entityId: Id.make(),
            } as InEntityInfo,
          },
        });
      }
      return table.makeSectionPack();
    };
    return packMakers;
  }, {} as TablePackMakers);
}
