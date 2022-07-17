import { z } from "zod";
import { monSchemas } from "../../../utils/mongoose";
import { zS } from "../../../utils/zod";
import { InEntity, mInEntities, zInEntities } from "./entities";

export type StringObj = {
  text: string;
  entities: InEntity[];
};

export function isStringObj(value: any): value is StringObj {
  return (
    typeof value === "object" &&
    "text" in value &&
    typeof value.text === "string" &&
    Array.isArray(value.entities)
  );
}

export function stringObj(text: string): StringObj {
  return {
    text,
    entities: [],
  };
}

export const initDefaultStringObj = ({
  text = "",
  entities = [],
}: Partial<StringObj> = {}) => ({ text, entities });

export const zStringObj = z.object({
  text: zS.string,
  entities: zInEntities,
} as { [K in keyof StringObj]: any });

export const mStringObj: Record<keyof StringObj, any> = {
  text: monSchemas.reqString,
  entities: mInEntities,
};

// I'm going to make new update functions for this
// I'll put them somewhere else, though.
// I'm not a fan of keeping the updateFns
// synced with the updateFnNames.

const stringObjUpdateFns = {
  editorUpdate: () => {},
};
