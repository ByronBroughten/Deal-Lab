import { z } from "zod";
import { monSchemas } from "../../../utils/mongoose";
import { zS } from "../../../utils/zod";
import { InEntity, mInEntities, zInEntities } from "./entities";

export type StringObj = {
  mainText: string;
  entities: InEntity[];
};

export function isStringObj(value: any): value is StringObj {
  return (
    typeof value === "object" &&
    "mainText" in value &&
    typeof value.mainText === "string" &&
    Array.isArray(value.entities)
  );
}

export function stringObj(mainText: string): StringObj {
  return {
    mainText,
    entities: [],
  };
}

export const initDefaultStringObj = ({
  mainText = "",
  entities = [],
}: Partial<StringObj> = {}) => ({ mainText, entities });

export const zStringObj = z.object({
  mainText: zS.string,
  entities: zInEntities,
} as { [K in keyof StringObj]: any });

export const mStringObj: Record<keyof StringObj, any> = {
  mainText: monSchemas.reqString,
  entities: mInEntities,
};

// I'm going to make new update functions for this
// I'll put them somewhere else, though.
// I'm not a fan of keeping the updateFns
// synced with the updateFnNames.

const stringObjUpdateFns = {
  editorUpdate: () => {},
};
