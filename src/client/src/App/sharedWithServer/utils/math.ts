import { arrsAndIsMixin } from "../../utils/classObjects";

export const Mth = {
  ...arrsAndIsMixin({
    arithmeticOperator: ["*", "/", "+", "-"],
  } as const),

  decimalToPercent(decimal: number) {
    const percent = decimal * 100;
    return percent;
  },
  percentToDecimal(percent: number) {
    return percent / 100;
  },
  percentToPortion({
    base,
    percentOfBase,
  }: {
    base: number;
    percentOfBase: number;
  }) {
    const decimalOfBase = this.percentToDecimal(percentOfBase);
    return base * decimalOfBase;
  },
  portionToPercent({ base, portionOfBase }: { [varbName: string]: number }) {
    const decimalOfBase = portionOfBase / base;
    return this.decimalToPercent(decimalOfBase);
  },
} as const;

const testIs: string = "lala";
if (Mth.is(testIs, "arithmeticOperator")) {
  testIs;
}
