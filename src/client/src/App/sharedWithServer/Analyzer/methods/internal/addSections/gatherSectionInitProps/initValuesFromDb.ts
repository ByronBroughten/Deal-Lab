import { sectionMetas } from "../../../../../SectionMetas";
import {
  DbNumObj,
  isDbNumObj,
  NumObj,
} from "../../../../../SectionMetas/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../../../../../SectionMetas/baseSections/baseValues/updateFnNames";
import {
  DbValue,
  UpdateFnName,
} from "../../../../../SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../../../SectionMetas/SectionName";
import { DbVarbs } from "../../../../DbEntry";
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
