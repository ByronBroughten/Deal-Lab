import { z } from "zod";
import { Arr } from "../utils/Arr";
import { ValidationError } from "../utils/Error";
import { validateS } from "../validateS";
import { StateValue } from "./StateValue";
import { inEntityInfoValueSchema } from "./StateValue/InEntityValue";
import { numObjMeta } from "./StateValue/NumObj";
import { stringObjMeta } from "./StateValue/StringObj";
import {
  isChangesSaving,
  isChangesToSave,
  validateChangesSaving,
  validateChangesToSave,
} from "./StateValue/sectionChanges";
import { ValueName, valueNames } from "./ValueName";
import { checkValueMetas } from "./valueMetas/valueMetaGeneric";
import { unionMetas } from "./valueMetas/valueMetaUnions";

export const valueMetas = checkValueMetas({
  number: {
    is: (v: any): v is number => typeof v === "number",
    validate: validateS.number,
    initDefault: () => 0,
    zod: z.number(),
  },
  dateTime: {
    is: (v: any): v is number => typeof v === "number",
    validate: validateS.number,
    initDefault: () => 0,
    zod: z.number(),
  },
  boolean: {
    is: (v: any): v is boolean => typeof v === "boolean",
    validate: validateS.boolean,
    initDefault: () => true,
    zod: z.boolean(),
  },
  string: {
    is: (v: any): v is string => typeof v === "string",
    validate: validateS.stringOneLine,
    initDefault: () => "",
    zod: z.string(),
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
    zod: z.array(z.string()),
  },
  stringObj: stringObjMeta,
  numObj: numObjMeta,
  inEntityValue: inEntityInfoValueSchema,
  changesToSave: {
    is: isChangesToSave,
    validate: validateChangesToSave,
    initDefault: () => ({}),
    zod: z.any(),
  },
  changesSaving: {
    is: isChangesSaving,
    validate: validateChangesSaving,
    initDefault: () => ({}),
    zod: z.any(),
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
      valueMetas[valueName].validate(value);
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
    if (valueMetas[valueName].is(value)) return true;
  }
  return false;
}

const zValueArr = Object.values(valueMetas).map((schema) => schema.zod) as [
  z.ZodTypeAny,
  z.ZodTypeAny
];
export const zValue = z.union(zValueArr);

export function isObjValue(
  value: any
): value is StateValue<"numObj"> | StateValue<"stringObj"> {
  return valueMetas.numObj.is(value) || valueMetas.stringObj.is(value);
}
