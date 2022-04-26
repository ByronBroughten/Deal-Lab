import { Obj } from "../../utils/Obj";
import { BaseName } from "../baseSectionTypes";
import { baseNameArrs } from "../baseSectionTypes/baseNameArrs";
import { relSections, RelSections } from "../relSections";

type TableSources = {
  [SN in BaseName<"tableNext">]: RelSections["fe"][SN]["tableSourceNameNext"];
};
function getTableSources(): TableSources {
  return baseNameArrs.fe.tableNext.reduce((tableSources, tableName) => {
    (tableSources[tableName] as TableSources[typeof tableName]) =
      relSections.fe[tableName]["tableSourceNameNext"];
    return tableSources;
  }, {} as TableSources);
}

export type SourceTables = {
  [SN in keyof TableSources as TableSources[SN]]: SN;
};
function getSourceTables(): SourceTables {
  const tableSources = getTableSources();
  return Obj.keys(tableSources).reduce((sourceTables, tableName) => {
    const sourceName = tableSources[tableName];
    (sourceTables[sourceName] as SourceTables[typeof sourceName]) = tableName;
    return sourceTables;
  }, {} as SourceTables);
}

export const sourceTables = getSourceTables();
export const tableSourceNames = Obj.keys(sourceTables);
