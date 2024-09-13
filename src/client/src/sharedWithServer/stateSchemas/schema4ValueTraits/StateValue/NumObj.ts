import { NotANumberError } from "../../../utils/math";
import { Obj } from "../../../utils/Obj";
import { StrictPick } from "../../../utils/types";
import { validateS } from "../../../utils/validateS";
import {
  validateValueInEntities,
  ValueInEntity,
} from "./stateValuesShared/entities";
import { EntitiesProp, MainTextProp } from "./stateValuesShared/ValueObj";

export interface NumObj extends MainTextProp, EntitiesProp {
  solvableText: string;
}

export function numToObj(value: number | NumObj): NumObj {
  return typeof value === "number" ? numObj(value) : value;
}

export function numObj(
  mainText: string | number = "",
  entities: ValueInEntity[] = [],
  solvableText: string = `${mainText}`
): NumObj {
  return {
    mainText: `${mainText}`,
    entities,
    solvableText,
  };
}

export const notApplicableString = "N/A";
export type NumberOrQ = number | "?";
export type NumObjOutput = NumberOrQ | typeof notApplicableString;
export type EntitiesAndEditorText = StrictPick<NumObj, "mainText" | "entities">;

export function numberOrQ(val: number) {
  try {
    if (`${val}` === "NaN") {
      throw new Error("no NaN allowed");
    }
    return val;
  } catch (ex) {
    if (ex instanceof NotANumberError) {
      return "?";
    } else {
      throw ex;
    }
  }
}

function isNumObj(value: any): value is NumObj {
  return (
    Obj.isObjToAny(value) &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}

export function validateNumObj(value: any): NumObj {
  const obj = Obj.validateObjToAny(value) as NumObj;
  return {
    mainText: validateS.stringOneLine(obj.mainText),
    entities: validateValueInEntities(obj.entities),
    solvableText: validateS.stringOneLine(obj.mainText),
  };
}

export const numObjMeta = {
  is: isNumObj,
  validate: validateNumObj,
  initDefault: ({
    mainText = "",
    entities = [],
    solvableText = mainText,
  }: Partial<NumObj> = {}) => ({
    mainText,
    entities,
    solvableText,
  }),
};
