import { Obj } from "../../utils/Obj";
import { allNull } from "../baseSections";
import { relSections } from "../relSections";
import { getRelParams } from "./getRelParams";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  relSections["fe"],
  "tableStoreName",
  "string"
);
const tableStoreParams = getRelParams(tableSourceNames, "tableStoreName");
const tableSourceParams = Obj.swapKeysAndValues(tableStoreParams);
export const allTableSourceParams = Obj.merge(allNull, tableSourceParams);
export type TableSourceParams = typeof allTableSourceParams;

const tableStoreNames = Obj.values(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
  tableStore: tableStoreNames,
};

// what I want is allTableSourceParams
