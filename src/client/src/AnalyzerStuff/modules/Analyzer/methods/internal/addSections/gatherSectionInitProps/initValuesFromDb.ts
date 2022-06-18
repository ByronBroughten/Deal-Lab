import { sectionMetas } from "../../../../../../../App/sharedWithServer/SectionsMeta";
import {
  DbNumObj,
  isDbNumObj,
  NumObj,
} from "../../../../../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../../../../../../../App/sharedWithServer/SectionsMeta/baseSections/baseValues/updateFnNames";
import {
  DbValue,
  UpdateFnName,
} from "../../../../../../../App/sharedWithServer/SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../../../../../App/sharedWithServer/SectionsMeta/SectionName";
import { DbVarbs } from "../../../../../../types/DbEntry";
import { VarbValues } from "../../../../StateSection/methods/varbs";
import { StateValue } from "../../../../StateSection/StateVarb/stateValue";

function stateFromDbNumObj(dbValue: DbNumObj): NumObj {
  return new NumObj(dbValue);
}

function stateFromDbValue(
  dbValue: DbValue,
  updateFnName: UpdateFnName
): StateValue {
  if (isDbNumObj(dbValue)) {
    if (isNumObjUpdateFnName(updateFnName)) return stateFromDbNumObj(dbValue);
    else {
      throw new Error("updateFnName should match dbValue type");
    }
  } else return dbValue as StateValue;
}

export function initValuesFromDb(
  sectionName: SectionName,
  dbVarbs: DbVarbs
): VarbValues {
  const { varbMetas } = sectionMetas.section(sectionName).core;
  const dbVarbEntries = Object.entries(dbVarbs);

  return dbVarbEntries.reduce((values, [varbName, dbValue]) => {
    if (varbName in varbMetas.getCore()) {
      const varbMeta = varbMetas.get(varbName);
      const updateFnName = varbMeta.defaultUpdateFnName;
      values[varbName] = stateFromDbValue(dbValue, updateFnName);
    }
    return values;
  }, {} as VarbValues);
}
