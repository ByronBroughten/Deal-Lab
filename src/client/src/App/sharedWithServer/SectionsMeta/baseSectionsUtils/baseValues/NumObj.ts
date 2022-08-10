import { z } from "zod";
import { reqMonString } from "../../../utils/mongoose";
import { StrictPick } from "../../../utils/types";
import { InEntities, InEntity, mInEntities, zInEntities } from "./entities";

export type NumObj = {
  editorText: string;
  entities: InEntity[];
  solvableText: string;
};
export const zNumObj = z.object({
  editorText: z.string(),
  entities: zInEntities,
  solvableText: z.string(),
} as { [K in keyof NumObj]: any });
export const mDbNumObj: Record<keyof NumObj, any> = {
  editorText: reqMonString,
  entities: mInEntities,
  solvableText: reqMonString,
};
export function isNumObj(value: any): value is NumObj {
  // speed is important here, which is why I don't use zod for it
  return (
    typeof value === "object" &&
    "editorText" in value &&
    typeof value.editorText === "string" &&
    Array.isArray(value.entities)
  );
}
export function numObj(
  editorText: string | number,
  entities: InEntities = [],
  solvableText: string = `${editorText}`
): NumObj {
  return {
    editorText: `${editorText}`,
    entities,
    solvableText,
  };
}
export type NumberOrQ = number | "?";
export type EntitiesAndEditorText = StrictPick<
  NumObj,
  "editorText" | "entities"
>;

export const numObjUnits = {
  percent: { roundTo: 5 },
  decimal: { roundTo: 7 },
  money: { roundTo: 2 },
} as const;
export type NumObjUnit = keyof typeof numObjUnits;
