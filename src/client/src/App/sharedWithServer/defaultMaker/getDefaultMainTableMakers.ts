import { makeVarbNamesInfo } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
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
// Is the error stemming from the tables?
// I don't think so.
export function getDefaultMainTableMakers(): TablePackMakers {
  const columnVarbnames = {
    dealMainTable: makeVarbNamesInfo("deal", outputNames),
    propertyMainTable: makeVarbNamesInfo("property", [
      "targetRentMonthly",
      "upfrontExpenses",
      "expensesMonthly",
    ]),
    loanMainTable: makeVarbNamesInfo("loan", [
      "interestRatePercentYearly",
      "loanTermYears",
      "closingCosts",
    ]),
    mgmtMainTable: makeVarbNamesInfo("mgmt", [
      "upfrontExpenses",
      "expensesMonthly",
    ]),
  } as const;

  return Obj.keys(columnVarbnames).reduce((packMakers, tableName) => {
    packMakers[tableName] = (): SectionPack<"compareTable"> => {
      const parent = PackBuilderSection.initAsOmniParent();
      const table = parent.addAndGetChild("compareTable");
      const { sectionName, varbNames } = columnVarbnames[tableName];
      for (const varbName of varbNames) {
        table.addChild("column", {
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