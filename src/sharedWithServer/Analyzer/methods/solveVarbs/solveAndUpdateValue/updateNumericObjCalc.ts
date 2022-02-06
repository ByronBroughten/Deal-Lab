import {
  FailedVarbs,
  GetSolvableTextProps,
  NumObj,
} from "../../../SectionMetas/relSections/rel/relValue/numObj";
import { replaceRange } from "../../../../utils/Str";
import Analyzer from "../../../../Analyzer";
import {
  FeVarbInfo,
  SpecificVarbInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import calculations, {
  CalcProp,
  isCalculationName,
} from "../../../SectionMetas/relSections/rel/relValue/numObj/calculations";
import { CalcNumObjFnName } from "../../../SectionMetas/relSections/rel/relValue/numObj/updateFnNames";

export function updateNumObjCalc(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  updateFnName: CalcNumObjFnName
): NumObj {
  const { dbNumObj } = this.value(feVarbInfo, "numObj");
  const { unit } = this.varb(feVarbInfo);
  const nextNumObj = new NumObj({
    updateFnName,
    unit,
    ...dbNumObj,
    ...this.getSolvableText(feVarbInfo, dbNumObj),
  });
  const { number } = nextNumObj;
  const editorText = typeof number === "number" ? `${number}` : "";
  return nextNumObj.updateCore({
    editorText,
  });
}

export function getSolvableRange(
  this: Analyzer,
  feVarbInfo: SpecificVarbInfo
): CalcProp {
  const varb = this.findVarb(feVarbInfo);
  if (!varb) return "?";
  return varb.value("numObj").number;
}

export function getSolvableText(
  this: Analyzer,
  feVarbInfo: FeVarbInfo,
  { editorText, entities = [] }: GetSolvableTextProps
): { solvableText: string; failedVarbs: FailedVarbs } {
  const updateFnName = this.updateFnName(feVarbInfo);
  if (isCalculationName(updateFnName)) {
    const { numberVarbs, failedVarbs } = this.getNumberVarbs(feVarbInfo);
    const solvableText = calculations[updateFnName](numberVarbs as any);
    return {
      solvableText,
      failedVarbs,
    };
  }

  let solvableText = editorText;
  const failedVarbs: FailedVarbs = [];

  for (const entity of entities) {
    // if the varbCan't be found then use a questionMark and add to failedVarbs, ya?
    const range = this.getSolvableRange(entity);
    if (range === "?")
      failedVarbs.push({
        errorMessage: "failedVarb",
        ...entity,
      });

    solvableText = replaceRange(
      solvableText,
      entity.offset,
      entity.offset + entity.length,
      `${range}`
    );
  }

  return { solvableText, failedVarbs };
}

export type NumberProps = { [name: string]: CalcProp | CalcProp[] };
export function getNumberVarbs(
  this: Analyzer,
  feVarbInfo: FeVarbInfo
): {
  numberVarbs: NumberProps;
  failedVarbs: FailedVarbs;
} {
  const numberVarbs: NumberProps = {};
  const failedVarbs: FailedVarbs = [];
  const updateFnProps = this.updateFnProps(feVarbInfo);

  for (let [propName, propOrArr] of Object.entries(updateFnProps)) {
    if (Array.isArray(propOrArr)) numberVarbs[propName] = [];
    else propOrArr = [propOrArr];
    for (const relInfo of propOrArr) {
      const inVarbs = this.varbsByFocal(feVarbInfo, relInfo);
      for (const inVarb of inVarbs) {
        const value = inVarb.value();
        if (!(value instanceof NumObj)) continue;
        let { number: num } = inVarb.value("numObj");
        if (num === "?") {
          failedVarbs.push({
            errorMessage: "failed varb",
            ...relInfo,
          });
        }
        const numArr = numberVarbs[propName];
        if (Array.isArray(numArr)) numArr.push(num);
        else numberVarbs[propName] = num;
      }
    }
  }

  return { numberVarbs, failedVarbs };
}
