import { z } from "zod";
import { reqMonString } from "../../../utils/mongoose";
import { StrictPick } from "../../../utils/types";
import { mInEntities, ValueInEntity, zInEntities } from "./entities";

export type NumObj = {
  mainText: string;
  entities: ValueInEntity[];
  solvableText: string;
};
export const zNumObj = z.object({
  mainText: z.string(),
  entities: zInEntities,
  solvableText: z.string(),
} as { [K in keyof NumObj]: any });
export const mDbNumObj: Record<keyof NumObj, any> = {
  mainText: reqMonString,
  entities: mInEntities,
  solvableText: reqMonString,
};
export function isNumObj(value: any): value is NumObj {
  // speed is important here, which is why we don't use zod
  return (
    typeof value === "object" &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}
export const numObjS = {
  validate(value: any): NumObj {
    if (isNumObj(value)) {
      return value;
    } else {
      throw new Error(`value "${value}" is not a NumObj`);
    }
  },
};

export function numObj(
  mainText: string | number,
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
