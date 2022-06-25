import { round } from "lodash";
import { evaluate } from "mathjs";
import { InEntity } from "../SectionsMeta/baseSections/baseValues/entities";
import {
  EntitiesAndEditorText,
  NumObjNumber,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSections/baseValues/updateFnNames";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterVarbBase } from "../StateGetters/Bases/GetterVarbBase";
import { GetterVarb } from "../StateGetters/GetterVarb";
import { arithmeticOperatorsArr, mathS } from "../utils/math";
import { Str } from "../utils/Str";

export const numObjUnits = {
  percent: { roundTo: 2 },
  decimal: { roundTo: 4 },
  money: { roundTo: 2, roundWithZeros: true },
} as const;

export class SolveNumObjVarb<
  SN extends SectionName
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  solvableTextFromTextAndEntities({
    editorText,
    entities,
  }: EntitiesAndEditorText): string {
    let solvableText = editorText;
    for (const entity of entities) {
      const num = this.getSolvableNumber(entity);
      solvableText = Str.replaceRange(
        solvableText,
        entity.offset,
        entity.offset + entity.length,
        `${num}`
      );
    }
    return solvableText;
  }
  private getSolvableNumber(inEntity: InEntity): NumObjNumber {
    if (this.get.sections.hasSectionMixed(inEntity)) {
      const varb = this.get.sections.varbByMixed(inEntity);
      return varb.value("numObj").number;
    } else return "?";
  }
  solvableTextToNumString(solvableText: string): string {
    const { updateFnName } = this.get;
    if (isNumObjUpdateFnName(updateFnName)) {
      const { unit } = this.get.meta;
      return `${this.solveText(solvableText)}`;
    } else {
      throw new Error("For now, this is only for numObjs.");
    }
  }
  solveText(text: string): NumObjNumber {
    const { updateFnName } = this.get;
    const { unit } = this.get.meta;
    if (!isNumObjUpdateFnName(updateFnName)) {
      throw new Error("This is only for numObjs.");
    }

    // the editor should handle when someone validly types left to right
    if (text[text.length - 1] === ".")
      // if there's a dot at the end, they could be about to enter a number
      text = text.substring(0, text.length - 1);

    if (text[text.length - 1] === "-")
      // if there's a minus at the end, they might be subtracting
      // or making a negative number, which could follow another operator
      text = text.substring(0, text.length - 1);
    if (arithmeticOperatorsArr.includes(text[text.length - 1]))
      // if there's an operator before those things, it's valid
      text = text.substring(0, text.length - 1);

    try {
      // this might be too complicated to untangle.

      let num = evaluate(text);
      if (mathS.isRationalNumber(num)) {
        num = this.doFinishingTouches(num);
        return round(num, numObjUnits[unit].roundTo);
      } else return "?";
    } catch (ex) {
      return "?";
    }
  }
  private doFinishingTouches(num: number): number {
    const { updateFnName } = this.get;
    if (updateFnName === "divideToPercent") num = mathS.decimalToPercent(num);
    return num;
  }
}
