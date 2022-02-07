export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const numberRegEx = /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/;
export const isStringRationalNumber = (str: string) => {
  // test that a string is a rational number

  let frontIdx = 0;
  if (str[0] === "-") frontIdx += 1;

  if (str[frontIdx] === ".")
    str = str.slice(0, frontIdx) + "0" + str.slice(frontIdx);

  if (str[str.length - 1] === ".") str = str + "0";

  return numberRegEx.test(str);
};

export function splitAtDot(fullName: string) {
  const names = fullName.split(".");
  return names;
}
