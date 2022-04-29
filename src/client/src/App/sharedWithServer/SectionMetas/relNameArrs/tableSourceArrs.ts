import { Obj } from "../../utils/Obj";
import { BaseName } from "../baseSectionTypes";
import { baseNameArrs } from "../baseSectionTypes/baseNameArrs";
import { getRelParams, RelParams } from "./getRelParams";

type TableSources = RelParams<BaseName<"tableNext">, "tableSourceNameNext">;
export type SourceTables = {
  [SN in keyof TableSources as TableSources[SN]]: SN;
};
function getSourceTables(): SourceTables {
  const tableSources = getRelParams(
    baseNameArrs.fe.tableNext,
    "tableSourceNameNext"
  );

  return Obj.keys(tableSources).reduce((sourceTables, tableName) => {
    const sourceName = tableSources[tableName];
    (sourceTables[sourceName] as SourceTables[typeof sourceName]) = tableName;
    return sourceTables;
  }, {} as SourceTables);
}

export const sourceTables = getSourceTables();
export const tableSourceNames = Obj.keys(sourceTables);
