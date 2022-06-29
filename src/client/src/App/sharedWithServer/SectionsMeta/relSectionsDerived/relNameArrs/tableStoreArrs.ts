import { Obj } from "../../../utils/Obj";
import { relSections } from "../../relSections";
import { getRelParams } from "./getRelParams";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  relSections,
  "tableStoreName",
  "string"
);

const tableStoreParams = getRelParams(tableSourceNames, "tableStoreName");
export const tableSourceParams = Obj.swapKeysAndValues(tableStoreParams);

const tableStoreNames = Obj.values(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
  tableStore: tableStoreNames,
};

// what I want is allTableSourceParams
