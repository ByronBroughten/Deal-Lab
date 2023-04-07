import { dbLimits } from "./utils/dbLimts";
import { ValidationError } from "./utils/Error";
import { mathS } from "./utils/math";
import { Str } from "./utils/Str";

export const validateValueS = {
  boolean: (value: any): boolean => {
    if (typeof value === "boolean") {
      return value;
    } else {
      throw new ValidationError(`value "${value}" is not a boolean`);
    }
  },
  number: (value: any): number => {
    const num = mathS.validateNumber(value);
    if (num > dbLimits.number.max) {
      throw new ValidationError(
        `"${num}" is greater than the maximum of ${dbLimits.number.max}`
      );
    }
    if (num < dbLimits.number.min) {
      throw new ValidationError(
        `"${num}" is less than the minimum of ${dbLimits.number.min}`
      );
    }
    return num;
  },
  stringOneLine: (value: any): string => {
    const str = Str.isString(value);
    if (str.length > dbLimits.stringOneLine.maxLength) {
      throw new ValidationError(
        `The given value is longer than the max length of ${dbLimits.stringOneLine.maxLength}`
      );
    }
    return str;
  },
  literal: <L extends string>(value: any, literal: L): L => {
    if (value === literal) {
      return value;
    } else {
      throw new ValidationError(
        `value "${value}" is does not match literal "${literal}"`
      );
    }
  },
  unionLiteral: <L extends any>(value: any, arr: L[]): L => {
    if (arr.includes(value)) {
      return value;
    } else {
      throw new ValidationError(`value "${value}" is not in the passed array`);
    }
  },
} as const;
