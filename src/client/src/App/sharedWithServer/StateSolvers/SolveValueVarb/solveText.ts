import { round } from "lodash";
import { evaluate } from "mathjs";
import { NumObjNumber } from "../../SectionsMeta/baseSections/baseValues/NumObj";
import { NumObjUpdateFnName } from "../../SectionsMeta/baseSections/baseValues/updateFnNames";
import { arithmeticOperatorsArr, mathS } from "../../utils/math";

export const numObjUnits = {
  percent: {
    roundTo: 2,
  },
  decimal: {
    roundTo: 4,
  },
  money: {
    roundTo: 2,
    roundWithZeros: true,
  },
} as const;

export type NumObjUnit = keyof typeof numObjUnits;

export function solveText(
  text: string,
  unit: NumObjUnit,
  updateFnName: NumObjUpdateFnName
): NumObjNumber {
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
      num = doFinishingTouches(num, updateFnName);
      return round(num, numObjUnits[unit].roundTo);
    } else return "?";
  } catch (ex) {
    return "?";
  }
}

function doFinishingTouches(
  num: number,
  updateFnName: NumObjUpdateFnName
): number {
  if (updateFnName === "divideToPercent") num = mathS.decimalToPercent(num);
  return num;
}
