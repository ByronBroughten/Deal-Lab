import {
  CalculatePiMonthlyProps,
  CalculatePiYearlyProps,
} from "./../../baseSectionsUtils/baseValues/calculations/piCalculations";
import { RelVarbInfo } from "./../../childSectionsDerived/RelVarbInfo";

export const relCheckUpdateProps = {
  piMonthly<T extends Record<keyof CalculatePiMonthlyProps, RelVarbInfo>>(
    t: T
  ): T {
    return t;
  },
  piYearly<T extends Record<keyof CalculatePiYearlyProps, RelVarbInfo>>(
    t: T
  ): T {
    return t;
  },
};
