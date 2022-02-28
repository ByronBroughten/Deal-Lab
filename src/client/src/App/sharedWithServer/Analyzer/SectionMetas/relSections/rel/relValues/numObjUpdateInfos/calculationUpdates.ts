import { round } from "lodash";
import { Mth } from "../../../../../../utils/math";
import { Obj } from "../../../../../../utils/Obj";
import { SubType } from "../../../../../../utils/types";
import { NumObj, NumObjNumber } from "../../../baseSections/baseValues/NumObj";
import { GatherName, GatherProps } from "../gatherProps";
import { BasicNumObjInherentProps } from "../numObjUpdates";
import { UpdateInfo } from "../updateInfo";

type GeneralCalcFn = (props: any) => string;
type CalcFn<G extends GatherName> = (
  props: Omit<GatherProps<G>, keyof BasicNumObjInherentProps>
) => string;
type NextCalcUpdateFn<G extends GatherName> = (props: GatherProps<G>) => NumObj;
function calcUpdateFn<F extends GeneralCalcFn>(
  fn: F
): (props: Parameters<F> & BasicNumObjInherentProps) => NumObj {
  return ({
    current,
    roundTo,
    finishingTouch,
    ...props
  }: Parameters<F> & BasicNumObjInherentProps) => {
    const solvableText = fn(props as any);
    const num = NumObj.solveText(solvableText, roundTo, finishingTouch);

    const next = current.updateCache({
      solvableText,
      number: num,
    });
    return next.updateCore({
      editorText: `${solvableText}`,
      entities: [],
    });
  };
}

function getPiMonthly({
  loanAmountDollarsTotal,
  interestRatePercentMonthly,
  loanTermMonths,
}: {
  loanAmountDollarsTotal: NumObjNumber;
  interestRatePercentMonthly: NumObjNumber;
  loanTermMonths: NumObjNumber;
}) {
  const L = loanAmountDollarsTotal;
  const r =
    typeof interestRatePercentMonthly === "number"
      ? Mth.percentToDecimal(interestRatePercentMonthly)
      : interestRatePercentMonthly;
  const n = loanTermMonths;

  const piMonthly = `${L} * ((${r} * (1 + ${r}) ** ${n}) / ((1 + ${r}) ** ${n} - 1))`;
  return piMonthly;
}

function updateCalcInfo<G extends GatherName, F extends CalcFn<G>>(
  gatherName: G,
  calcFn: F
): UpdateInfo<G, NextCalcUpdateFn<G>> {
  return {
    gatherName,
    updateFn: calcUpdateFn(calcFn) as any as NextCalcUpdateFn<G>,
  };
}

const calculationUpdateInfos = {
  one: updateCalcInfo("none", ({}) => "1"),
  monthlyToYearly: updateCalcInfo("num", ({ num }) => `${num} * 12`),
  get yearsToMonths() {
    return this.monthlyToYearly;
  }, // 1 year = 12 months
  yearlyToMonthly: updateCalcInfo("num", ({ num }) => `${num} / 12`), // $120/year = $12/month
  get monthsToYears() {
    return this.yearlyToMonthly;
  }, // 12 months = 1 year

  decimalToPercent: updateCalcInfo("num", ({ num }) => `${num} * 100`),
  percentToDecimal: updateCalcInfo("num", ({ num }) => `${num} / 100`),
  // multiple num props
  sumNums: updateCalcInfo("nums", ({ nums }) => {
    let solvableText = "";
    for (let num of nums) {
      if (num === "?") continue;
      if (solvableText === "") solvableText = `${num}`;
      else solvableText = solvableText + `+${num}`;
    }
    if (!solvableText) solvableText = "0";
    return solvableText;
  }),
  // two props, i.e., left and right
  simpleSubtract: updateCalcInfo(
    "leftRight",
    ({ left, right }) => `${left} - ${right}`
  ),
  simpleDivide: updateCalcInfo(
    "leftRight",
    ({ left, right }) => `${left} / ${right}`
  ),
  get divideToPercent() {
    return this.simpleDivide;
    // This is an alias to prompt that the value be converted to a percent
    // after the division, in the "finishingTouches" stage, to
    // preserver the solvableText for display
  },
  percentToDecimalTimesBase: updateCalcInfo("leftRight", ({ left, right }) => {
    const roundTo = NumObj.roundTo.percent;
    const decimalLeft =
      typeof left === "number"
        ? round(Mth.percentToDecimal(left), roundTo)
        : left;
    return `${decimalLeft} * ${right}`;
  }),
  // one-offs
  percentToPortion: updateCalcInfo(
    "basePercentOfBase",
    ({ base, percentOfBase }) => {
      const roundTo = NumObj.roundTo.decimal;
      const decimalOfBase =
        typeof percentOfBase === "number"
          ? round(Mth.percentToDecimal(percentOfBase), roundTo)
          : percentOfBase;
      return `${base} * ${decimalOfBase}`;
    }
  ),
  portionToDecimal: updateCalcInfo(
    "basePortionOfBase",
    ({ base, portionOfBase }) => `${portionOfBase} / ${base}`
  ),
  piMonthly: updateCalcInfo("piMonthly", getPiMonthly),
  get piYearly() {
    return updateCalcInfo(
      "piYearly",
      ({
        // assumes monthly loan payments
        loanAmountDollarsTotal,
        interestRatePercentYearly,
        loanTermYears,
      }) => {
        return getPiMonthly({
          loanAmountDollarsTotal,
          interestRatePercentMonthly:
            typeof interestRatePercentYearly === "number"
              ? interestRatePercentYearly / 12
              : interestRatePercentYearly,
          loanTermMonths:
            typeof loanTermYears === "number"
              ? loanTermYears * 12
              : loanTermYears,
        });
      }
    );
  },
} as const;

type CalculationUpdateInfos = typeof calculationUpdateInfos;
export type CalcUpdateFnName = keyof CalculationUpdateInfos;

export type UpdateByGatherName<GN extends GatherName> = keyof SubType<
  CalculationUpdateInfos,
  { gatherName: GN }
>;

export const calculationUpdates = {
  all: calculationUpdateInfos,
  get names(): CalcUpdateFnName[] {
    return Obj.keys(this.all) as CalcUpdateFnName[];
  },
  isName(value: any): value is typeof this.names[number] {
    return this.names.includes(value);
  },
} as const;
