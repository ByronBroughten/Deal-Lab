import { z } from "zod";
import { monSchemas } from "../../../utils/mongoose";
import { Obj } from "../../../utils/Obj";
import { zS } from "../../../utils/zod";
import { mInEntities, ValueInEntity, zInEntities } from "./entities";

export type EntitiesProp = {
  entities: ValueInEntity[];
};

export interface StringObj extends EntitiesProp {
  mainText: string;
}

export function hasEntitiesProp(value: any): value is EntitiesProp {
  if (Obj.isObjToAny(value) && Array.isArray(value.entities)) {
    return true;
  } else {
    return false;
  }
}

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
