export const Str = {
  compareAlphanumerically(a: string, b: string) {
    return a.localeCompare(b, undefined, { numeric: true });
  },
} as const;

export const replaceRange = (
  str: string,
  start: number,
  end: number,
  replacement: string
) => {
  return str.substring(0, start) + replacement + str.substring(end);
};

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

export function isRationalNumber(num: any): num is number {
  return typeof num === "number" && isStringRationalNumber(`${num}`);
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
