import { z } from "zod";
import { reqMonString } from "../../../utils/mongoose";
import { StrictPick } from "../../../utils/types";
import {
  mInEntities,
  ValueInEntity,
  zValueInEntities,
} from "./valuesShared/entities";

export type NumObj = {
  mainText: string;
  entities: ValueInEntity[];
  solvableText: string;
};

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
export type NumberOrQ = number | "?";
export type EntitiesAndEditorText = StrictPick<NumObj, "mainText" | "entities">;

const zNumObj = z.object({
  mainText: z.string(),
  entities: zValueInEntities,
  solvableText: z.string(),
} as { [K in keyof NumObj]: any });
const mNumObj: Record<keyof NumObj, any> = {
  mainText: reqMonString,
  entities: mInEntities,
  solvableText: reqMonString,
};
function isNumObj(value: any): value is NumObj {
  // speed is important here, which is why we don't use zod
  return (
    typeof value === "object" &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}

export const numObjMeta = {
  is: isNumObj,
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
  mon: mNumObj,
};
