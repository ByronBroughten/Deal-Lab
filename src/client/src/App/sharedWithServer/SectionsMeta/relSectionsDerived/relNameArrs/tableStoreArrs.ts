import { Obj } from "../../../utils/Obj";
import { relSections } from "../../relSections";
import { getRelParams } from "./getRelParams";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  relSections,
  "feTableIndexStoreName",
  "string"
);

const tableStoreParams = getRelParams(
  tableSourceNames,
  "feTableIndexStoreName"
);
export const tableSourceParams = Obj.swapKeysAndValues(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
};
