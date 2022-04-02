import { sectionMetas } from "../../../../SectionMetas";
import {
  DbNumObj,
  isDbNumObj,
  NumObj,
} from "../../../../SectionMetas/relSections/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../../../../SectionMetas/relSections/baseSections/baseValues/NumObj/updateFnNames";
import { UpdateFnName } from "../../../../SectionMetas/relSections/rel/valueMetaTypes";
import { SectionName } from "../../../../SectionMetas/SectionName";
import { DbValue, DbVarbs } from "../../../../DbEntry";
import { VarbValues } from "../../../../StateSection/methods/varbs";
import { StateValue } from "../../../../StateSection/StateVarb/stateValue";

function stateFromDbNumObj(dbValue: DbNumObj): NumObj {
  return new NumObj({
    ...dbValue,
    // at the very least, editorText equivalent to a rational number
    // must load into solvableText, or else nothing can solve
    // That might not be the case anymore, though, now that solvableText and number
    // are created at update time.
  });
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
  } else return dbValue;
}

export function initValuesFromDb(
  sectionName: SectionName,
  dbVarbs: DbVarbs
): VarbValues {
  const varbsMeta = sectionMetas.get(sectionName).varbMetas;
  const dbVarbEntries = Object.entries(dbVarbs);

  return dbVarbEntries.reduce((values, [varbName, dbValue]) => {
    if (varbName in varbsMeta.getCore()) {
      const varbMeta = varbsMeta.get(varbName);
      const updateFnName = varbMeta.defaultUpdateFnName;
      values[varbName] = stateFromDbValue(dbValue, updateFnName);
    }
    return values;
  }, {} as VarbValues);
}
