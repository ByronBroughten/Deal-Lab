import { sectionMetas } from "../../../../SectionMetas";
import { DbValue, DbVarbs } from "../../../../DbEntry";
import {
  DbNumObj,
  isDbNumObj,
  NumObj,
  NumObjUnit,
} from "../../../../SectionMetas/relSections/rel/relValue/numObj";
import {
  isNumObjUpdateFnName,
  NumObjUpdateFnName,
} from "../../../../SectionMetas/relSections/rel/relValue/numObj/updateFnNames";
import { UpdateFnName } from "../../../../SectionMetas/relSections/rel/relValueTypes";
import { SectionName } from "../../../../SectionMetas/SectionName";
import { VarbValues } from "../../../../StateSection/methods/varbs";
import { StateValue } from "../../../../StateSection/StateVarb/stateValue";

function stateFromDbNumObj(
  dbValue: DbNumObj,
  updateFnName: NumObjUpdateFnName,
  unit: NumObjUnit
): NumObj {
  return new NumObj({
    updateFnName,
    ...dbValue,
    solvableText: dbValue.editorText,
    // at the very least, editorText equivalent to a rational number
    // must load into solvableText, or else nothing can solve
    failedVarbs: [],
    unit,
  });
}

function stateFromDbValue(
  dbValue: DbValue,
  updateFnName: UpdateFnName,
  unit?: NumObjUnit
): StateValue {
  if (isDbNumObj(dbValue)) {
    if (isNumObjUpdateFnName(updateFnName) && unit)
      return stateFromDbNumObj(dbValue, updateFnName, unit);
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
      values[varbName] = stateFromDbValue(dbValue, updateFnName, varbMeta.unit);
    }
    return values;
  }, {} as VarbValues);
}
