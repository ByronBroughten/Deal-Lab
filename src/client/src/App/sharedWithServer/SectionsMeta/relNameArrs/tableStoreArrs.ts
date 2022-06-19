import { Obj } from "../../utils/Obj";
import { SimpleSectionName, simpleSectionNames } from "../baseSections";
import { relSections } from "../relSections";
import { getRelParams } from "./getRelParams";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  relSections["fe"],
  "tableStoreName",
  "string"
);
const tableStoreParams = getRelParams(tableSourceNames, "tableStoreName");
const tableStoreNames = Obj.values(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
  tableStore: tableStoreNames,
};

const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

// what I want is allTableSourceParams
const allTableStoreParams = Obj.merge(allNull, tableStoreParams);
