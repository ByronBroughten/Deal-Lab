import { isNumber } from "lodash";
import { mathS } from "../../../../utils/math";
import { CalcProp } from "../calculations";

export function calcPropMath(v: CalcProp, fn: (v: number) => number): CalcProp {
  return isNumber(v) ? fn(v) : v;
}

export const calcPropS = {
  percentToDecimal(v: CalcProp): CalcProp {
    return calcPropMath(v, mathS.percentToDecimal);
  },
  yearlyToMonthly(v: CalcProp): CalcProp {
    return isNumber(v) ? mathS.yearlyToMonthly(v) : v;
  },
};
