import { inEntityInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/InEntityInfoValue";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeUserTableName } from "../SectionsMeta/relChildSections";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

type TablePackMakers = {
  [CN in FeUserTableName]: () => SectionPack<"compareTable">;
};
export function makeDefaultFeUserTables(): TablePackMakers {
  const columnVarbnames = {
    dealMainTable: {
      sectionName: "deal",
      varbNames: outputNames,
    },
    propertyMainTable: {
      sectionName: "property",
      varbNames: ["price", "numBedrooms", "targetRentMonthly"],
    },
    loanMainTable: {
      sectionName: "loan",
      varbNames: ["interestRatePercentMonthly", "loanTermYears"],
    },
    mgmtMainTable: {
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
    packMakers[tableName] = (): SectionPack<"compareTable"> => {
      const parent = PackBuilderSection.initAsOmniParent();
      const table = parent.addAndGetChild("compareTable");
      const { sectionName, varbNames } = columnVarbnames[tableName];
      for (const varbName of varbNames) {
        table.addChild("column", {
          // doy.
          // ok.
          dbVarbs: {
            valueEntityInfo: inEntityInfo({
              infoType: "globalSection",
              expectedCount: "onlyOne",
              sectionName,
              varbName,
            }),
          },
        });
      }
      return table.makeSectionPack();
    };
    return packMakers;
  }, {} as TablePackMakers);
}
