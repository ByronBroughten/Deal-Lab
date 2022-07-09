import { Schema } from "mongoose";
import { z } from "zod";
import { reqMonString } from "../../../utils/mongoose";
import { StrictPick } from "../../../utils/types";
import { InEntities, InEntity, zInEntities } from "./entities";

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
export const mDbNumObj: { [key in keyof NumObj]: any } = {
  editorText: reqMonString,
  entities: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: (v: any) => zInEntities.safeParse(v).success,
    },
  },
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
