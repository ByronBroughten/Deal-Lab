import { z } from "zod";
import { NotANumberError } from "../../../utils/math";
import { Obj } from "../../../utils/Obj";
import { StrictPick } from "../../../utils/types";
import { validateS } from "../../../validateS";
import {
  validateValueInEntities,
  ValueInEntity,
  zValueInEntities,
} from "./valuesShared/entities";
import { EntitiesProp, MainTextProp } from "./valuesShared/valueObj";

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

const zNumObj = z.object({
  mainText: z.string(),
  entities: zValueInEntities,
  solvableText: z.string(),
} as { [K in keyof NumObj]: any });

function isNumObj(value: any): value is NumObj {
  // top speed is important here, which is why we don't use zod
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
  zod: zNumObj,
};
