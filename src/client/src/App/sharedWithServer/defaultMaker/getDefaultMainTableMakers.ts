import { inEntityInfo } from "../SectionsMeta/baseSectionsVarbs/baseValues/InEntityInfoValue";
import { DbSectionPack } from "../SectionsMeta/childSectionsDerived/DbSectionPack";
import { SectionPack } from "../SectionsMeta/childSectionsDerived/SectionPack";
import { FeStoreNameByType } from "../SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { PackBuilderSection } from "../StatePackers.ts/PackBuilderSection";
import { Obj } from "../utils/Obj";
import { outputNames } from "./makeDefaultOutputList";

type DefaultTables = {
  [CN in FeStoreNameByType<"mainTableName">]: DbSectionPack<CN>[];
};
export function makeDefaultTablePackArrs(): DefaultTables {
  const tableMakers = getDefaultMainTableMakers();
  return Obj.keys(tableMakers).reduce((defaultTables, tableName) => {
    defaultTables[tableName] = [tableMakers[tableName]()];
    return defaultTables;
  }, {} as DefaultTables);
}

type TablePackMakers = {
  [CN in FeStoreNameByType<"mainTableName">]: () => SectionPack<"compareTable">;
};
export function getDefaultMainTableMakers(): TablePackMakers {
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
