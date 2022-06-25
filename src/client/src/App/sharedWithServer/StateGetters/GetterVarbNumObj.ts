import { round } from "lodash";
import { evaluate } from "mathjs";
import { InEntity } from "../SectionsMeta/baseSections/baseValues/entities";
import {
  EntitiesAndEditorText,
  NumObj,
  NumObjNumber,
} from "../SectionsMeta/baseSections/baseValues/NumObj";
import { isNumObjUpdateFnName } from "../SectionsMeta/baseSections/baseValues/updateFnNames";
import { SectionName } from "../SectionsMeta/SectionName";
import { arithmeticOperatorsArr, mathS } from "../utils/math";
import { Str } from "../utils/Str";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterVarb } from "./GetterVarb";

export const numObjUnits = {
  percent: { roundTo: 2 },
  decimal: { roundTo: 4 },
  money: { roundTo: 2, roundWithZeros: true },
} as const;

export type NumObjUnit = keyof typeof numObjUnits;

export class GetterVarbNumObj<
  SN extends SectionName
> extends GetterVarbBase<SN> {
  get get() {
    return new GetterVarb(this.getterVarbProps);
  }
  get value(): NumObj {
    return this.get.value("numObj");
  }
  get editorTextStatus() {
    if (["", "-"].includes(this.value.editorText as any)) return "empty";
    if (Str.isRationalNumber(this.value.editorText)) return "number";
    else return "solvableText";
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
  solveTextToNumStringNext(): string {
    const { solvableText } = this.get.value("numObj");
    return this.solveTextToNumString(solvableText);
  }
  solveTextToNumString(solvableText: string): string {
    return `${this.solveText(solvableText)}`;
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
