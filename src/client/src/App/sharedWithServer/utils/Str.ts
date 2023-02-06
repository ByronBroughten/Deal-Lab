import { IsType } from "./types";

export function replaceRange(
  str: string,
  start: number,
  end: number,
  replacement: string
) {
  return str.substring(0, start) + replacement + str.substring(end);
}

type JoinStrings<F extends string, B extends string> = keyof {
  [S in F as `${F}${B}`]: any;
};

export const Str = {
  join<F extends string, B extends string>(
    front: F,
    back: B
  ): JoinStrings<F, B> {
    return `${front}${back}`;
  },
  validate(value: any): string {
    if (typeof value === "string") {
      return value;
    } else {
      throw new Error(`value "${value}" is not a string.`);
    }
  },
  isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        return false;
      } else throw ex;
    }
  },
  makeStringTypeGuard<T extends string>(arr: readonly T[]): IsType<T> {
    return (value: any): value is T => arr.includes(value);
  },
  emailBeforeAt(emailAddress: string) {
    return emailAddress.substring(0, emailAddress.indexOf("@"));
  },
  compareAlphanumerically(a: string, b: string) {
    return a.localeCompare(b, undefined, { numeric: true });
  },
  replaceRange,
  isRationalNumber: isStringRationalNumber,
} as const;

const numberRegEx = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/;
export function isStringRationalNumber(str: string) {
  // test that a string is a rational number

  let frontIdx = 0;
  if (str[0] === "-") frontIdx += 1;

  if (str[frontIdx] === ".")
    str = str.slice(0, frontIdx) + "0" + str.slice(frontIdx);

  if (str[str.length - 1] === ".") str = str + "0";

  return numberRegEx.test(str);
}

export function splitAtDot(fullName: string) {
  const names = fullName.split(".");
  return names;
}
export function capitalizeFirstLetter<T extends string>(
  str: T
): Capitalize<string & T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<string & T>;
}
