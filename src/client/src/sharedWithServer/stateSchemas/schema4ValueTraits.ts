import { Arr } from "../utils/Arr";
import { ValidationError } from "../utils/Error";
import { validateS } from "../utils/validateS";
import { ValueName, valueNames } from "./schema1ValueNames";
import { checkValueTraits } from "./schema4ValueTraits/checkValueTraits";
import { StateValue } from "./schema4ValueTraits/StateValue";
import { inEntityInfoValueSchema } from "./schema4ValueTraits/StateValue/InEntityValue";
import { numObjMeta } from "./schema4ValueTraits/StateValue/NumObj";
import {
  isChangesSaving,
  isChangesToSave,
  validateChangesSaving,
  validateChangesToSave,
} from "./schema4ValueTraits/StateValue/sectionChanges";
import { stringObjMeta } from "./schema4ValueTraits/StateValue/StringObj";
import { unionMetas } from "./schema4ValueTraits/valueMetaUnions";

export const valueTraits = checkValueTraits({
  number: {
    is: (v: any): v is number => typeof v === "number",
    validate: validateS.number,
    initDefault: () => 0,
  },
  dateTime: {
    is: (v: any): v is number => typeof v === "number",
    validate: validateS.number,
    initDefault: () => 0,
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    validate: validateS.boolean,
    initDefault: () => true,
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    validate: validateS.stringOneLine,
    initDefault: () => "",
  },
  stringArray: {
    is(v: any): v is string[] {
      try {
        this.validate(v);
        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          return false;
        } else {
          throw err;
        }
      }
    },
    validate: (value: any) => {
      const arr = Arr.validateIsArray(value);
      if (arr.every((i: any) => validateS.stringOneLine(i))) {
        return arr;
      } else {
        throw new ValidationError(
          `value is an array but its items aren't all strings`
        );
      }
    },
    initDefault: () => [] as string[],
  },
  stringObj: stringObjMeta,
  numObj: numObjMeta,
  inEntityValue: inEntityInfoValueSchema,
  changesToSave: {
    is: isChangesToSave,
    validate: validateChangesToSave,
    initDefault: () => ({}),
  },
  changesSaving: {
    is: isChangesSaving,
    validate: validateChangesSaving,
    initDefault: () => ({}),
  },
  ...unionMetas,
});

export function validateStateValue<VN extends ValueName = ValueName>(
  value: any,
  ...passedNames: VN[]
): StateValue<VN> {
  const names = passedNames.length > 0 ? passedNames : valueNames;
  for (const valueName of names) {
    try {
      valueTraits[valueName].validate(value);
      return value;
    } catch (err) {
      if (!(err instanceof ValidationError)) {
        throw err;
      }
    }
  }
  throw new ValidationError(
    `value "${value}" is not a stateValue of valueName "${names.join(", ")}"`
  );
}
export function isStateValue(value: any): value is StateValue {
  for (const valueName of valueNames) {
    if (valueTraits[valueName].is(value)) return true;
  }
  return false;
}

export function isObjValue(
  value: any
): value is StateValue<"numObj"> | StateValue<"stringObj"> {
  return valueTraits.numObj.is(value) || valueTraits.stringObj.is(value);
}
