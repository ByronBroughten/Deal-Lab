import { Arr } from "../../../../sharedWithServer/utils/Arr";
import { Obj } from "../../../../sharedWithServer/utils/Obj";

function checkOption<O extends string>(valueSwitch: any, options: O[]): O {
  if (options.includes(valueSwitch)) {
    return valueSwitch;
  } else {
    throw new Error(`"${valueSwitch}" is not one of the options`);
  }
}

export function useOption<O extends Record<string, any>, VS extends string>(
  options: O,
  valueSwitch: VS
): {
  option: O[keyof O];
  nextValueSwitch: keyof O;
} {
  const optionKeys = Obj.keys(options);
  const checkedSwitch = checkOption(valueSwitch, optionKeys);
  const nextValueSwitch = Arr.nextRotatingValue(optionKeys, checkedSwitch);
  return {
    option: options[checkedSwitch],
    nextValueSwitch,
  };
}
