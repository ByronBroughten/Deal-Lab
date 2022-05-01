import { Obj } from "../../utils/Obj";
import { BaseName } from "../baseSectionTypes";
import { baseNameArrs } from "../baseSectionTypes/baseNameArrs";
import { getRelParams, RelParams } from "./getRelParams";

type TableIndexNames = RelParams<BaseName<"tableNext">, "tableIndexName">;
export type IndexTableNames = {
  [SN in keyof TableIndexNames as TableIndexNames[SN]]: SN;
};

function getIndexToTableNames(): IndexTableNames {
  const tableIndexNames = getRelParams(
    baseNameArrs.fe.tableNext,
    "tableIndexName"
  );

  return Obj.keys(tableIndexNames).reduce((indexToTableNames, tableName) => {
    const sourceName = tableIndexNames[tableName];
    (indexToTableNames[sourceName] as IndexTableNames[typeof sourceName]) =
      tableName;
    return indexToTableNames;
  }, {} as IndexTableNames);
}

export const indexToTableNames = getIndexToTableNames();
export const tableIndexNames = Obj.keys(indexToTableNames);
