import { Obj } from "../../../utils/Obj";
import { allSectionTraits, getSomeSectionTraits } from "../../sectionsTraits";

const tableSourceNames = Obj.entryKeysWithPropOfType(
  allSectionTraits,
  "compareTableName",
  "string"
);

const tableStoreParams = getSomeSectionTraits(
  tableSourceNames,
  "compareTableName"
);
export const tableSourceParams = Obj.swapKeysAndValues(tableStoreParams);
export const tableStoreNameArrs = {
  tableSource: tableSourceNames,
};
