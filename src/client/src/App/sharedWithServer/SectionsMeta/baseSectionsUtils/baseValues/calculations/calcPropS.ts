import { isNumber } from "lodash";
import { CalcProp } from "../calculations";
import {
  percentToDecimalRounded,
  yearlyToMonthlyRounded,
} from "./numUnitParams";

export function calcPropMath(v: CalcProp, fn: (v: number) => number): CalcProp {
  return isNumber(v) ? fn(v) : v;
}

export const calcPropS = {
  percentToDecimal(v: CalcProp): CalcProp {
    return calcPropMath(v, percentToDecimalRounded);
  },
  yearlyToMonthly(v: CalcProp): CalcProp {
    return isNumber(v) ? yearlyToMonthlyRounded(v) : v;
  },
};
